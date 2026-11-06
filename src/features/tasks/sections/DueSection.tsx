import { clearReminder, getReminder, setReminder } from '../../../db/schedule'
import { Icon } from '../../../ui/Icon'
import type { TaskSection } from '../extension-types'

const OPTIONS: [number, string][] = [
  [0, 'No horário do prazo'],
  [15, '15 minutos antes'],
  [60, '1 hora antes'],
  [1440, '1 dia antes'],
]

export const section: TaskSection = {
  order: 10,

  Component({ draft, set }) {
    return (
      <div className="two">
        <div className="field">
          <label htmlFor="f-due">Prazo</label>
          <input
            id="f-due"
            type="date"
            className="input"
            data-testid="task-form-due-date"
            value={draft.dueDate ?? ''}
            onChange={(e) => set(e.target.value ? { dueDate: e.target.value } : { dueDate: null, dueTime: null })}
          />
        </div>
        <div className="field">
          <label htmlFor="f-time">Horário (opcional)</label>
          <input
            id="f-time"
            type="time"
            className="input"
            data-testid="task-form-due-time"
            disabled={!draft.dueDate}
            value={draft.dueTime ?? ''}
            onChange={(e) => set({ dueTime: e.target.value || null })}
          />
        </div>
      </div>
    )
  },

  More({ draft, errors, setExtra }) {
    const value = (draft.extra.reminder as number | null | undefined) ?? null
    return (
      <div className="field">
        <label htmlFor="f-remind">Lembrete</label>
        <select
          id="f-remind"
          className="select"
          data-testid="task-form-reminder"
          value={value === null ? '' : String(value)}
          aria-invalid={errors.reminder ? true : undefined}
          aria-describedby="f-remind-err"
          onChange={(e) => setExtra('reminder', e.target.value === '' ? null : Number(e.target.value))}
        >
          <option value="">Sem lembrete</option>
          {OPTIONS.map(([m, label]) => (
            <option key={m} value={m}>
              {label}
            </option>
          ))}
        </select>
        <div className="err" id="f-remind-err" role="alert" hidden={!errors.reminder}>
          <Icon name="alert" size={16} />
          {errors.reminder}
        </div>
        <div className="help">Sem horário definido, o prazo conta como 09:00.</div>
      </div>
    )
  },

  async load(task) {
    return { reminder: (await getReminder(task.id))?.minutesBefore ?? null }
  },

  validate(draft) {
    const m = draft.extra.reminder
    const errs: Record<string, string> = {}
    if (m !== null && m !== undefined && !draft.dueDate) errs.reminder = 'Defina um prazo para usar o lembrete.'
    return errs
  },

  async onSaved(task, draft, initial) {
    const next = (draft.extra.reminder as number | null | undefined) ?? null
    // Só mexe quando mudou: regravar rearmaria um aviso que já disparou.
    if (next === ((initial.reminder as number | null | undefined) ?? null)) return
    if (next === null) await clearReminder(task.id)
    else await setReminder(task.id, next)
  },
}
