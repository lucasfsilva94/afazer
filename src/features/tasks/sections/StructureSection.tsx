import { useState } from 'react'
import { useGroups } from '../../../db/groups'
import { newId } from '../../../db/repo'
import { listSubtasks, saveSubtasks, type SubtaskDraft } from '../../../db/structure'
import type { Freq } from '../../../db/types'
import { subtaskProgress } from '../../../domain/progress'
import { Button, IconButton } from '../../../ui/Button'
import { Icon } from '../../../ui/Icon'
import type { SectionProps, TaskSection } from '../extension-types'

const FREQ: [Freq, string][] = [
  ['diaria', 'Todo dia'],
  ['semanal', 'Toda semana'],
  ['mensal', 'Todo mês'],
]

const subsOf = (draft: SectionProps['draft']) => (draft.extra.subtasks as SubtaskDraft[] | undefined) ?? []

function Subtasks({ draft, setExtra }: SectionProps) {
  const [text, setText] = useState('')
  const subs = subsOf(draft)
  const { done, total } = subtaskProgress(subs)
  const update = (next: SubtaskDraft[]) => setExtra('subtasks', next)
  const add = () => {
    const title = text.trim()
    if (!title) return
    update([...subs, { id: newId(), title, done: false }])
    setText('')
  }
  return (
    <div className="field">
      <span className="lbl" id="f-subs-l">
        Subtarefas
      </span>
      {total > 0 && (
        <div className="mini-prog" aria-label={`${done} de ${total} subtarefas concluídas`}>
          <div className="bar lg" aria-hidden="true">
            <i style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <span className="n">
            {done}/{total}
          </span>
        </div>
      )}
      <ul className="subs" aria-labelledby="f-subs-l">
        {subs.map((s) => (
          <li key={s.id} className={`sub${s.done ? ' done' : ''}`} data-testid="subtask-row">
            <button
              type="button"
              className="chk"
              data-testid="subtask-toggle"
              aria-pressed={s.done}
              aria-label={`${s.done ? 'Reabrir' : 'Concluir'} subtarefa: ${s.title}`}
              onClick={() => update(subs.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x)))}
            >
              <span className="chk-box">
                <Icon name="check" size={16} strokeWidth={3} />
              </span>
            </button>
            <span className="st">{s.title}</span>
            <IconButton label={`Remover subtarefa: ${s.title}`} danger onClick={() => update(subs.filter((x) => x.id !== s.id))}>
              <Icon name="x" size={18} />
            </IconButton>
          </li>
        ))}
      </ul>
      <div className="sub-add">
        <input
          className="input"
          data-testid="subtask-input"
          maxLength={100}
          aria-label="Nova subtarefa"
          placeholder="Adicionar subtarefa"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault() // não envia o formulário inteiro
              e.stopPropagation()
              add()
            }
          }}
        />
        <Button onClick={add}>Adicionar</Button>
      </div>
    </div>
  )
}

export const section: TaskSection = {
  order: 30,

  More(props) {
    const { draft, errors, set } = props
    const projects = useGroups('project')
    const r = draft.recurrence
    return (
      <>
        <div className="field">
          <label htmlFor="f-proj">Projeto</label>
          <select
            id="f-proj"
            className="select"
            data-testid="task-form-project"
            value={draft.projectId ?? ''}
            onChange={(e) => set({ projectId: e.target.value || null })}
          >
            <option value="">Sem projeto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="two">
          <div className="field">
            <label htmlFor="f-recur">Repetir</label>
            <select
              id="f-recur"
              className="select"
              data-testid="task-form-recurrence"
              value={r?.freq ?? ''}
              aria-invalid={errors.recurrence ? true : undefined}
              aria-describedby="f-recur-err"
              onChange={(e) =>
                set({ recurrence: e.target.value ? { freq: e.target.value as Freq, interval: r?.interval ?? 1, until: r?.until ?? null } : null })
              }
            >
              <option value="">Não repete</option>
              {FREQ.map(([v, label]) => (
                <option key={v} value={v}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {r && (
            <div className="field">
              <label htmlFor="f-until">Repetir até (opcional)</label>
              <input
                id="f-until"
                type="date"
                className="input"
                value={r.until ?? ''}
                onChange={(e) => set({ recurrence: { ...r, until: e.target.value || null } })}
              />
            </div>
          )}
        </div>
        {r && (
          <div className="field">
            <label htmlFor="f-interval">A cada quantas repetições</label>
            <input
              id="f-interval"
              type="number"
              min={1}
              className="input"
              value={r.interval}
              onChange={(e) => set({ recurrence: { ...r, interval: Math.max(1, Math.floor(Number(e.target.value)) || 1) } })}
            />
          </div>
        )}
        <div className="err" id="f-recur-err" role="alert" hidden={!errors.recurrence}>
          <Icon name="alert" size={16} />
          {errors.recurrence}
        </div>

        <Subtasks {...props} />
      </>
    )
  },

  async load(task) {
    const subs = await listSubtasks(task.id)
    return { subtasks: subs.map(({ id, title, done }) => ({ id, title, done })) }
  },

  validate(draft) {
    const errs: Record<string, string> = {}
    if (draft.recurrence && !draft.dueDate) errs.recurrence = 'Defina um prazo para repetir a tarefa.'
    return errs
  },

  async onSaved(task, draft, initial) {
    const next = subsOf(draft)
    const before = (initial.subtasks as SubtaskDraft[] | undefined) ?? []
    if (JSON.stringify(next) !== JSON.stringify(before)) await saveSubtasks(task.id, next)
  },
}
