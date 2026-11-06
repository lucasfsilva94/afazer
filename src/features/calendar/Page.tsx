import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import type { Task } from '../../db/types'
import { addDays, fmtLong, fmtMonth, todayStr, ymd } from '../../domain/dates'
import { isOverdue } from '../../domain/status'
import { Button, IconButton } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'
import { Icon } from '../../ui/Icon'
import { openNewTask } from '../../ui/actions'
import { useNow } from '../../ui/useNow'
import { TaskRow } from '../tasks/TaskRow'

const DOW = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const SHOWN = 2

/** Grade 7×6 começando no domingo que antecede (ou é) o dia 1. */
function gridDays(y: number, m0: number): string[] {
  const first = new Date(y, m0, 1)
  const start = addDays(ymd(first), -first.getDay())
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

export default function CalendarPage() {
  const now = useNow()
  const today = todayStr(now)
  const [view, setView] = useState(() => ({ y: now.getFullYear(), m: now.getMonth() }))
  const [selected, setSelected] = useState(today)

  const days = useMemo(() => gridDays(view.y, view.m), [view])
  const from = days[0]
  const to = days[41]

  // Só as tarefas da janela visível, pelo índice de prazo.
  const tasks = useLiveQuery(() => db.tasks.where('dueDate').between(from, to, true, true).toArray(), [from, to])
  const byDay = useMemo(() => {
    const m = new Map<string, Task[]>()
    for (const t of tasks ?? []) m.set(t.dueDate!, [...(m.get(t.dueDate!) ?? []), t])
    return m
  }, [tasks])

  const go = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1)
    setView({ y: d.getFullYear(), m: d.getMonth() })
  }
  const goToday = () => {
    setView({ y: now.getFullYear(), m: now.getMonth() })
    setSelected(today)
  }

  const dayTasks = byDay.get(selected) ?? []

  return (
    <div className="cal-wrap">
      <div>
        <div className="cal-head">
          <h2 aria-live="polite">{fmtMonth(view.y, view.m)}</h2>
          <IconButton label="Mês anterior" data-testid="calendar-prev" onClick={() => go(-1)}>
            <Icon name="chevL" size={20} />
          </IconButton>
          <Button className="btn-sm" onClick={goToday}>
            Hoje
          </Button>
          <IconButton label="Próximo mês" data-testid="calendar-next" onClick={() => go(1)}>
            <Icon name="chevR" size={20} />
          </IconButton>
        </div>
        <div className="cal-grid" role="grid" aria-label={fmtMonth(view.y, view.m)}>
          {DOW.map((d) => (
            <div key={d} className="cal-dow" role="columnheader">
              {d}
            </div>
          ))}
          {days.map((date) => {
            const list = byDay.get(date) ?? []
            const cls = ['cal-cell', date.slice(0, 7) !== `${view.y}-${String(view.m + 1).padStart(2, '0')}` && 'out', date === today && 'today', date === selected && 'sel']
              .filter(Boolean)
              .join(' ')
            return (
              <button
                key={date}
                type="button"
                className={cls}
                data-testid="calendar-day"
                data-date={date}
                aria-pressed={date === selected}
                aria-label={`${fmtLong(date)}, ${list.length === 1 ? '1 tarefa' : `${list.length} tarefas`}`}
                onClick={() => setSelected(date)}
              >
                <span className="d">{Number(date.slice(8))}</span>
                {list.slice(0, SHOWN).map((t) => (
                  <span key={t.id} className={`cc${t.done ? ' dn' : isOverdue(t, now) ? ' ov' : ''}`}>
                    {(t.done || isOverdue(t, now)) && <span className="sr-only">{t.done ? 'Concluída: ' : 'Atrasada: '}</span>}
                    {t.title}
                  </span>
                ))}
                {list.length > SHOWN && <span className="more">+{list.length - SHOWN} mais</span>}
                <span className={`cnt${list.length ? '' : ' zero'}`}>{list.length}</span>
              </button>
            )
          })}
        </div>
      </div>

      <section className="card" aria-labelledby="cal-day-h">
        <div className="sec-head">
          <h2 id="cal-day-h" className="cap-first">
            {fmtLong(selected)}
          </h2>
        </div>
        {dayTasks.length === 0 ? (
          <EmptyState icon="cal" title="Nenhuma tarefa neste dia" text="Escolha outro dia ou adicione uma tarefa com este prazo." />
        ) : (
          <ul className="tasks">
            {dayTasks.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
          </ul>
        )}
        <Button className="more-btn" onClick={() => openNewTask({ dueDate: selected })}>
          <Icon name="plus" />
          Adicionar neste dia
        </Button>
      </section>
    </div>
  )
}
