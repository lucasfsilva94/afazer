import { dueLabel, todayStr } from '../../../domain/dates'
import { isOverdue } from '../../../domain/status'
import { Chip } from '../../../ui/Chip'
import { Icon } from '../../../ui/Icon'
import { useNow } from '../../../ui/useNow'
import type { TaskChip } from '../extension-types'

export const chip: TaskChip = {
  order: 10,
  Component({ task }) {
    const now = useNow()
    if (!task.dueDate) return null
    const label = dueLabel(task.dueDate, task.dueTime, now)
    // Atraso sempre com ícone e texto, nunca só cor (FR-008).
    if (isOverdue(task, now)) {
      return (
        <Chip tone="over" testId="task-overdue-badge">
          <Icon name="alert" size={14} />
          Atrasada · {label}
        </Chip>
      )
    }
    return (
      <Chip tone={task.dueDate === todayStr(now) && !task.done ? 'today' : 'default'}>
        <Icon name="clock" size={14} />
        {label}
      </Chip>
    )
  },
}
