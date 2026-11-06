import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import { fmtShort, todayStr } from '../../domain/dates'
import { completedPerDay, completedPerWeek, completionRate } from '../../domain/stats'
import { BarChart } from '../../ui/BarChart'
import { EmptyState } from '../../ui/EmptyState'
import { useNow } from '../../ui/useNow'

type Mode = 'dia' | 'semana'

export default function StatsPage() {
  const tasks = useLiveQuery(() => db.tasks.toArray(), [])
  const now = useNow()
  const [mode, setMode] = useState<Mode>('dia')

  const s = useMemo(() => {
    const t = tasks ?? []
    const perDay = completedPerDay(t, now, 14)
    const perWeek = completedPerWeek(t, now, 8)
    return { perDay, perWeek, rate: completionRate(t), last7: perDay.slice(-7).reduce((n, b) => n + b.count, 0) }
  }, [tasks, now])

  if (!tasks) return null
  if (tasks.length === 0) {
    return <EmptyState icon="chart" title="Sem dados ainda" text="Crie e conclua tarefas para ver suas estatísticas de produtividade." />
  }

  const today = todayStr(now)
  const bars =
    mode === 'dia'
      ? s.perDay.map((b) => ({ label: fmtShort(b.key).replace(/ de /, ' '), value: b.count, highlight: b.key === today }))
      : s.perWeek.map((b, i, a) => ({ label: fmtShort(b.key), value: b.count, highlight: i === a.length - 1 }))

  return (
    <div className="od-stack" style={{ ['--od-gap' as string]: 'var(--sp-5)' }}>
      <div className="stats-grid">
        <div className="stat-tile" data-testid="stat-completed-day">
          <div className="n">{s.perDay[s.perDay.length - 1].count}</div>
          <div className="c">Concluídas hoje</div>
        </div>
        <div className="stat-tile" data-testid="stat-completed-week">
          <div className="n">{s.last7}</div>
          <div className="c">Concluídas nos últimos 7 dias</div>
        </div>
        <div className="stat-tile" data-testid="stat-completion-rate">
          <div className="n">{s.rate.rate === null ? '—' : `${Math.round(s.rate.rate * 100)}%`}</div>
          <div className="c">
            Taxa de conclusão · {s.rate.done} de {s.rate.total}
          </div>
        </div>
      </div>

      <section className="card">
        <div className="sec-head">
          <h2>Concluídas por {mode === 'dia' ? 'dia' : 'semana'}</h2>
          <div className="seg" role="group" aria-label="Período do gráfico">
            <button type="button" aria-pressed={mode === 'dia'} onClick={() => setMode('dia')}>
              Dia
            </button>
            <button type="button" aria-pressed={mode === 'semana'} onClick={() => setMode('semana')}>
              Semana
            </button>
          </div>
        </div>
        <BarChart data={bars} title={mode === 'dia' ? 'Tarefas concluídas nos últimos 14 dias' : 'Tarefas concluídas nas últimas 8 semanas'} />
      </section>
    </div>
  )
}
