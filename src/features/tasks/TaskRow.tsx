import { memo, useState } from 'react'
import { deleteTask, setDone } from '../../db/tasks'
import type { Task } from '../../db/types'
import { IconButton } from '../../ui/Button'
import { ConfirmDialog } from '../../ui/ConfirmDialog'
import { Icon } from '../../ui/Icon'
import { useToast } from '../../ui/Toast'
import { openEditTask } from '../../ui/actions'
import type { TaskChip } from './extension-types'

// Cada história acrescenta um arquivo em `chips/` (export `chip`).
const modules = import.meta.glob<{ chip: TaskChip }>('./chips/*.tsx', { eager: true })
const chips = Object.values(modules)
  .map((m) => m.chip)
  .filter(Boolean)
  .sort((a, b) => a.order - b.order)

export const TaskRow = memo(function TaskRow({ task }: { task: Task }) {
  const [confirming, setConfirming] = useState(false)
  const toast = useToast()

  async function toggle() {
    await setDone(task.id, !task.done)
    // A linha pode trocar de lista; o foco volta ao mesmo controle.
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(`[data-task-id="${task.id}"] [data-testid="task-toggle"]`)?.focus(),
    )
  }

  async function remove() {
    setConfirming(false)
    await deleteTask(task.id)
    toast.show('Tarefa excluída')
  }

  return (
    <li className={`task${task.done ? ' is-done' : ''}`} data-testid="task-row" data-task-id={task.id}>
      <button
        type="button"
        className="chk"
        data-testid="task-toggle"
        aria-pressed={task.done}
        aria-label={`${task.done ? 'Reabrir' : 'Concluir'}: ${task.title}`}
        onClick={() => void toggle()}
      >
        <span className="chk-box">
          <Icon name="check" size={16} strokeWidth={3} />
        </span>
      </button>
      <div className="tbody">
        <button type="button" className="ttitle od-clamp-2" onClick={() => openEditTask(task)}>
          {task.title}
        </button>
        {task.description && <p className="tdesc od-clamp-2">{task.description}</p>}
        <div className="meta od-cluster">
          {chips.map((c, i) => (
            <c.Component key={i} task={task} />
          ))}
        </div>
      </div>
      <div className="tact">
        <IconButton label={`Editar: ${task.title}`} data-testid="task-edit" onClick={() => openEditTask(task)}>
          <Icon name="edit" size={20} />
        </IconButton>
        <IconButton label={`Excluir: ${task.title}`} danger data-testid="task-delete" onClick={() => setConfirming(true)}>
          <Icon name="trash" size={20} />
        </IconButton>
      </div>
      <ConfirmDialog
        open={confirming}
        title="Excluir tarefa?"
        message={`“${task.title}” e suas subtarefas serão removidas de vez. Isso não pode ser desfeito.`}
        onConfirm={() => void remove()}
        onCancel={() => setConfirming(false)}
      />
    </li>
  )
})
