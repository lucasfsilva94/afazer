import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/schema'
import type { Task } from '../../db/types'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'
import { TaskRow } from '../tasks/TaskRow'
import { ManageGroups } from './ManageGroups'

const PAGE = 50

function ProjectGroup({ name, tasks }: { name: string; tasks: Task[] }) {
  const [limit, setLimit] = useState(PAGE)
  const done = tasks.filter((t) => t.done).length
  const sorted = [...tasks].sort((a, b) => Number(a.done) - Number(b.done) || b.createdAt - a.createdAt)
  return (
    <section className="group" data-testid="project-group">
      <div className="group-head">
        <h3>{name}</h3>
        {tasks.length > 0 && (
          <div className="prog" aria-hidden="true">
            <div className="bar lg">
              <i style={{ width: `${(done / tasks.length) * 100}%` }} />
            </div>
          </div>
        )}
        <span className="count">
          {done}/{tasks.length}
        </span>
      </div>
      {tasks.length === 0 ? (
        <p className="muted">Nenhuma tarefa neste projeto.</p>
      ) : (
        <ul className="tasks">
          {sorted.slice(0, limit).map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </ul>
      )}
      {sorted.length > limit && <Button className="more-btn" onClick={() => setLimit((l) => l + PAGE)}>Mostrar mais ({sorted.length - limit})</Button>}
    </section>
  )
}

export default function ProjectsPage() {
  const data = useLiveQuery(async () => ({
    tasks: await db.tasks.toArray(),
    projects: (await db.projects.toArray()).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
  }), [])

  const tasks = data?.tasks ?? []
  const projects = data?.projects ?? []
  const loose = tasks.filter((t) => !t.projectId || !projects.some((p) => p.id === t.projectId))

  return (
    <div className="proj-wrap">
      <div>
        {data && projects.length === 0 && tasks.length === 0 ? (
          <EmptyState icon="folder" title="Nenhum projeto ainda" text="Crie um projeto ao lado e associe tarefas a ele no diálogo da tarefa." />
        ) : (
          <>
            {projects.map((p) => (
              <ProjectGroup key={p.id} name={p.name} tasks={tasks.filter((t) => t.projectId === p.id)} />
            ))}
            {loose.length > 0 && <ProjectGroup name="Sem projeto" tasks={loose} />}
          </>
        )}
      </div>
      <ManageGroups />
    </div>
  )
}
