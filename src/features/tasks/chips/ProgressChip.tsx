import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../db/schema'
import type { Freq } from '../../../db/types'
import { subtaskProgress } from '../../../domain/progress'
import { Chip } from '../../../ui/Chip'
import { Icon } from '../../../ui/Icon'
import type { TaskChip } from '../extension-types'

const FREQ_LABEL: Record<Freq, string> = { diaria: 'Diária', semanal: 'Semanal', mensal: 'Mensal' }

export const chip: TaskChip = {
  order: 30,
  Component({ task }) {
    const subs = useLiveQuery(() => db.subtasks.where('taskId').equals(task.id).toArray(), [task.id])
    const project = useLiveQuery(() => (task.projectId ? db.projects.get(task.projectId) : undefined), [task.projectId])
    const { done, total } = subtaskProgress(subs ?? [])
    return (
      <>
        {total > 0 && (
          <Chip testId="task-progress" title="Progresso das subtarefas">
            <Icon name="sub" size={14} />
            <span className="mini-prog">
              {done}/{total}
              <span className="bar" aria-hidden="true">
                <i style={{ width: `${(done / total) * 100}%` }} />
              </span>
            </span>
          </Chip>
        )}
        {project && (
          <Chip>
            <Icon name="folder" size={14} />
            {project.name}
          </Chip>
        )}
        {task.recurrence && (
          <Chip>
            <Icon name="repeat" size={14} />
            {FREQ_LABEL[task.recurrence.freq]}
          </Chip>
        )}
      </>
    )
  },
}
