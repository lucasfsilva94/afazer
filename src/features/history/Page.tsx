import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import type { Activity, ActivityType } from '../../db/types'
import { addDays, fmtShort, hm, todayStr, ymd } from '../../domain/dates'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'
import { Icon, type IconName } from '../../ui/Icon'

const PAGE = 60 // FR-027: "Mostrar mais" a cada 60

const META: Record<ActivityType, { label: string; icon: IconName; cls: string }> = {
  criada: { label: 'Criada', icon: 'plus', cls: '' },
  concluida: { label: 'Concluída', icon: 'check', cls: 'done' },
  reaberta: { label: 'Reaberta', icon: 'repeat', cls: '' },
  editada: { label: 'Editada', icon: 'edit', cls: '' },
  excluida: { label: 'Excluída', icon: 'trash', cls: 'del' },
}

function dayLabel(date: string, today: string) {
  return date === today ? 'Hoje' : date === addDays(today, -1) ? 'Ontem' : fmtShort(date)
}

export default function HistoryPage() {
  const [limit, setLimit] = useState(PAGE)
  const total = useLiveQuery(() => db.activity.count(), [])
  const items = useLiveQuery(() => db.activity.orderBy('at').reverse().limit(limit).toArray(), [limit])
  if (total === undefined || !items) return null

  if (total === 0) {
    return <EmptyState icon="history" title="Nenhuma atividade ainda" text="Criar, concluir, editar e excluir tarefas aparece aqui, em ordem cronológica." />
  }

  const today = todayStr()
  const groups: [string, Activity[]][] = []
  for (const a of items) {
    const d = ymd(new Date(a.at))
    const last = groups[groups.length - 1]
    if (last && last[0] === d) last[1].push(a)
    else groups.push([d, [a]])
  }

  return (
    <div>
      {groups.map(([date, list]) => (
        <section key={date}>
          <h2 className="day-label">{dayLabel(date, today)}</h2>
          <ul className="hist">
            {list.map((a) => {
              const m = META[a.type]
              return (
                <li key={a.id} data-testid="activity-item">
                  <span className={`ic ${m.cls}`}>
                    <Icon name={m.icon} />
                  </span>
                  <div className="od-fill">
                    <div className="act">{m.label}</div>
                    <div className="tt">{a.taskTitle}</div>
                  </div>
                  <time className="tm" dateTime={new Date(a.at).toISOString()}>
                    {hm(new Date(a.at))}
                  </time>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
      {total > items.length && (
        <Button className="more-btn" onClick={() => setLimit((l) => l + PAGE)}>
          Mostrar mais ({total - items.length})
        </Button>
      )}
    </div>
  )
}
