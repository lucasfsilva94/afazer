import { useEffect, useState } from 'react'
import { createTask, deleteTask, updateTask } from '../../db/tasks'
import type { Task } from '../../db/types'
import { Button, IconButton } from '../../ui/Button'
import { ConfirmDialog } from '../../ui/ConfirmDialog'
import { Icon } from '../../ui/Icon'
import { Modal } from '../../ui/Modal'
import { useToast } from '../../ui/Toast'
import { EDIT_TASK, NEW_TASK, type NewTaskDetail } from '../../ui/actions'
import { draftFromTask, emptyDraft, type Draft, type TaskSection } from './extension-types'

// Cada história acrescenta um arquivo em `sections/` (export `section`).
const modules = import.meta.glob<{ section: TaskSection }>('./sections/*.tsx', { eager: true })
const sections = Object.values(modules)
  .map((m) => m.section)
  .filter(Boolean)
  .sort((a, b) => a.order - b.order)

interface DialogState {
  open: boolean
  task: Task | null
  defaults?: NewTaskDetail
}

/** Escuta os pedidos de "nova tarefa" e "editar" vindos de qualquer tela. */
export function TaskDialogHost() {
  const [state, setState] = useState<DialogState>({ open: false, task: null })

  useEffect(() => {
    const onNew = (e: Event) => setState({ open: true, task: null, defaults: (e as CustomEvent<NewTaskDetail>).detail })
    const onEdit = (e: Event) => setState({ open: true, task: (e as CustomEvent<Task>).detail })
    window.addEventListener(NEW_TASK, onNew)
    window.addEventListener(EDIT_TASK, onEdit)
    return () => {
      window.removeEventListener(NEW_TASK, onNew)
      window.removeEventListener(EDIT_TASK, onEdit)
    }
  }, [])

  return (
    <Modal open={state.open} onClose={() => setState((s) => ({ ...s, open: false }))} labelledBy="task-dialog-title">
      <TaskForm task={state.task} defaults={state.defaults} onClose={() => setState((s) => ({ ...s, open: false }))} />
    </Modal>
  )
}

function TaskForm({ task, defaults, onClose }: { task: Task | null; defaults?: NewTaskDetail; onClose: () => void }) {
  const toast = useToast()
  const [draft, setDraft] = useState<Draft>(() =>
    task ? draftFromTask(task) : { ...emptyDraft(), dueDate: defaults?.dueDate ?? null },
  )
  const [initial, setInitial] = useState<Record<string, unknown> | null>(task ? null : {})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [more, setMore] = useState(false)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!task) return
    let live = true
    void Promise.all(sections.map((s) => s.load?.(task) ?? {})).then((parts) => {
      if (!live) return
      const extra = Object.assign({}, ...parts) as Record<string, unknown>
      setDraft((d) => ({ ...d, extra }))
      setInitial(extra)
    })
    return () => {
      live = false
    }
  }, [task])

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }))
  const setExtra = (key: string, value: unknown) => setDraft((d) => ({ ...d, extra: { ...d.extra, [key]: value } }))

  async function save() {
    const errs: Record<string, string> = {}
    if (!draft.title.trim()) errs.title = 'Informe um título para a tarefa.'
    for (const s of sections) Object.assign(errs, s.validate?.(draft))
    setErrors(errs)
    setFormError('')
    if (Object.keys(errs).length) {
      if (Object.keys(errs).some((k) => k !== 'title')) setMore(true)
      return
    }
    try {
      const { extra: _extra, ...fields } = draft
      const saved = task ? await updateTask(task.id, fields, task.updatedAt) : await createTask(fields)
      for (const s of sections) await s.onSaved?.(saved, draft, initial ?? {})
      toast.show(task ? 'Tarefa salva' : 'Tarefa criada')
      onClose()
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Não foi possível salvar.')
    }
  }

  async function remove() {
    if (!task) return
    setConfirming(false)
    await deleteTask(task.id)
    toast.show('Tarefa excluída')
    onClose()
  }

  const props = { draft, task, errors, set, setExtra }

  return (
    <>
      <div className="dlg-head">
        <h2 id="task-dialog-title">{task ? 'Editar tarefa' : 'Nova tarefa'}</h2>
        <IconButton label="Fechar" onClick={onClose}>
          <Icon name="x" size={20} />
        </IconButton>
      </div>
      {initial === null ? (
        <div className="dlg-body">
          <p className="muted">Carregando…</p>
        </div>
      ) : (
        <div className="dlg-body">
          <div className="field">
            <label htmlFor="f-title">
              Título <span className="req" aria-hidden="true">*</span>
            </label>
            <input
              id="f-title"
              className="input"
              data-autofocus
              data-testid="task-form-title"
              maxLength={140}
              autoComplete="off"
              required
              value={draft.title}
              aria-invalid={errors.title ? true : undefined}
              aria-describedby="f-title-err"
              onChange={(e) => set({ title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void save()
                }
              }}
            />
            <div className="err" id="f-title-err" role="alert" hidden={!errors.title}>
              <Icon name="alert" size={16} />
              {errors.title}
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-desc">Descrição</label>
            <textarea
              id="f-desc"
              className="textarea"
              data-testid="task-form-description"
              maxLength={600}
              value={draft.description}
              onChange={(e) => set({ description: e.target.value })}
            />
          </div>
          {sections.map((s, i) => s.Component && <s.Component key={i} {...props} />)}
          {sections.some((s) => s.More) && (
            <details className="more-opts" open={more} onToggle={(e) => setMore(e.currentTarget.open)}>
              <summary>Mais opções</summary>
              <div className="more-inner">{sections.map((s, i) => s.More && <s.More key={i} {...props} />)}</div>
            </details>
          )}
          <div className="err" role="alert" hidden={!formError}>
            <Icon name="alert" size={16} />
            {formError}
          </div>
        </div>
      )}
      <div className="dlg-foot">
        {task && (
          <Button variant="danger" className="grow" data-testid="task-form-delete" onClick={() => setConfirming(true)}>
            Excluir
          </Button>
        )}
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="primary" data-testid="task-form-save" disabled={initial === null} onClick={() => void save()}>
          Salvar
        </Button>
      </div>
      <ConfirmDialog
        open={confirming}
        title="Excluir tarefa?"
        message="A tarefa e suas subtarefas serão removidas de vez. Isso não pode ser desfeito."
        onConfirm={() => void remove()}
        onCancel={() => setConfirming(false)}
      />
    </>
  )
}
