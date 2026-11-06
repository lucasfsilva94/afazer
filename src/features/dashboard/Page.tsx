import { useMemo, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db } from '../../db/schema'
import type { Task } from '../../db/types'
import { fmtLong, ymd } from '../../domain/dates'
import { groupForDashboard, todayProgress } from '../../domain/dashboard'
import { EmptyState } from '../../ui/EmptyState'
import { ProgressRing } from '../../ui/ProgressRing'
import { useNow } from '../../ui/useNow'
import { QuickAdd } from '../tasks/QuickAdd'
import { TaskRow } from '../tasks/TaskRow'

const PENDING_SHOWN = 6

function Section({ title, tasks, testId, over, children }: { title: string; tasks: Task[]; testId: string; over?: boolean; children?: ReactNode }) {
  return (
    <section data-testid={testId} aria-labelledby={`${testId}-h`}>
      <div className="sec-head">
        <h2 id={`${testId}-h`}>{title}</h2>
        <span className={`count${over ? ' over' : ''}`}>{tasks.length}</span>
      </div>
      {children}
    </section>
  )
}

const list = (tasks: Task[]) => (
  <ul className="tasks">
    {tasks.map((t) => (
      <TaskRow key={t.id} task={t} />
    ))}
  </ul>
)

const greeting = (h: number) => (h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite')

export default function DashboardPage() {
  const all = useLiveQuery(() => db.tasks.toArray(), [])
  const now = useNow()
  const g = useMemo(() => groupForDashboard(all ?? [], now), [all, now])
  const progress = useMemo(() => todayProgress(all ?? [], now), [all, now])
  if (!all) return null

  const todayOpen = g.today.filter((t) => !t.done).length
  const sortedToday = [...g.today].sort((a, b) => Number(a.done) - Number(b.done) || (a.dueTime ?? '99').localeCompare(b.dueTime ?? '99'))

  return (
    <div className="dash">
      <div>
        <h2 className="hello">{greeting(now.getHours())}</h2>
        <p className="hello-sub">{fmtLong(ymd(now))}</p>
        <QuickAdd />

        {g.overdue.length > 0 && (
          <Section title="Atrasadas" tasks={g.overdue} testId="dashboard-overdue" over>
            {list(g.overdue)}
          </Section>
        )}

        <Section title="Hoje" tasks={g.today} testId="dashboard-today">
          {g.today.length === 0 ? (
            <EmptyState icon="sparkle" title="Nada para hoje" text="Nenhuma tarefa com prazo hoje. Aproveite, ou adicione uma acima." />
          ) : (
            list(sortedToday)
          )}
        </Section>

        <Section title="Pendentes" tasks={g.pending} testId="dashboard-pending">
          {g.pending.length === 0 ? (
            <EmptyState icon="check" title="Sem pendências" text="Todas as tarefas abertas estão em dia." />
          ) : (
            <>
              {list(g.pending.slice(0, PENDING_SHOWN))}
              {g.pending.length > PENDING_SHOWN && (
                <Link className="link-btn" to="/tarefas">
                  Ver todas as {g.pending.length} pendentes
                </Link>
              )}
            </>
          )}
        </Section>
      </div>

      <aside className="side-col" aria-label="Resumo do dia">
        <div className="card ring-card" data-testid="dashboard-progress">
          <ProgressRing value={progress.total ? progress.done / progress.total : 0} label="Progresso de hoje" />
          <div className="ring-info">
            <h2>Progresso do dia</h2>
            <p>
              {progress.total
                ? `${progress.done} de ${progress.total} ${progress.total === 1 ? 'tarefa' : 'tarefas'} de hoje concluída${progress.done === 1 ? '' : 's'}`
                : 'Nenhuma tarefa prevista para hoje'}
            </p>
          </div>
        </div>
        <div className="stats-strip">
          <div className="stat-tile">
            <div className="n">{todayOpen}</div>
            <div className="c">Para hoje</div>
          </div>
          <div className="stat-tile">
            <div className="n">{g.pending.length}</div>
            <div className="c">Pendentes</div>
          </div>
          <div className={`stat-tile${g.overdue.length ? ' over' : ''}`}>
            <div className="n">{g.overdue.length}</div>
            <div className="c">Atrasadas</div>
          </div>
        </div>
      </aside>
    </div>
  )
}
