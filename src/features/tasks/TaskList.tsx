import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSearchParams } from 'react-router-dom'
import { db } from '../../db/schema'
import type { Task } from '../../db/types'
import { applyView, paramsFromSearch } from '../../domain/view'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'
import { Icon } from '../../ui/Icon'
import { openNewTask } from '../../ui/actions'
import type { TaskToolbar } from './extension-types'
import { TaskRow } from './TaskRow'

const PAGE = 50 // FR-027: "Mostrar mais" a cada 50

// Cada história acrescenta um arquivo em `toolbar/` (export `toolbar`).
const modules = import.meta.glob<{ toolbar: TaskToolbar }>('./toolbar/*.tsx', { eager: true })
const toolbars = Object.values(modules)
  .map((m) => m.toolbar)
  .filter(Boolean)
  .sort((a, b) => a.order - b.order)

function Group({ title, tasks, className }: { title?: string; tasks: Task[]; className?: string }) {
  const [limit, setLimit] = useState(PAGE)
  if (!tasks.length) return null
  return (
    <section className={className}>
      {title && (
        <div className="sec-head">
          <h2>{title}</h2>
          <span className="count">{tasks.length}</span>
        </div>
      )}
      <ul className="tasks">
        {tasks.slice(0, limit).map((t) => (
          <TaskRow key={t.id} task={t} />
        ))}
      </ul>
      {tasks.length > limit && (
        <Button className="more-btn" onClick={() => setLimit((l) => l + PAGE)}>
          Mostrar mais ({tasks.length - limit})
        </Button>
      )}
    </section>
  )
}

export function TaskList() {
  const [sp, setSp] = useSearchParams()
  const all = useLiveQuery(() => db.tasks.toArray(), [])
  const params = useMemo(() => paramsFromSearch(sp), [sp])

  const { pending, done } = useMemo(() => {
    const newestFirst = [...(all ?? [])].sort((a, b) => b.createdAt - a.createdAt)
    const view = applyView(newestFirst, params)
    return { pending: view.filter((t) => !t.done), done: view.filter((t) => t.done) }
  }, [all, params])

  if (!all) return null

  const body =
    all.length === 0 ? (
      <EmptyState icon="inbox" title="Nenhuma tarefa ainda" text="Digite um título acima e pressione Enter para criar a primeira.">
        <Button variant="primary" onClick={() => openNewTask()}>
          <Icon name="plus" />
          Nova tarefa
        </Button>
      </EmptyState>
    ) : pending.length + done.length === 0 ? (
      <EmptyState icon="search" title="Nenhuma tarefa encontrada" text="Nada corresponde à busca e aos filtros atuais.">
        <Button onClick={() => setSp({})}>Limpar filtros</Button>
      </EmptyState>
    ) : (
      <>
        <Group tasks={pending} />
        <Group title="Concluídas" tasks={done} className="done-group" />
      </>
    )

  return (
    <div>
      {toolbars.map((t, i) => (
        <t.Component key={i} />
      ))}
      {body}
    </div>
  )
}
