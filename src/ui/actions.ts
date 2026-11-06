import type { Task } from '../db/types'

// Ponte entre o cabeçalho/telas e o diálogo de tarefa, sem que `ui/` dependa de `features/`.
export const NEW_TASK = 'todo:new-task'
export const EDIT_TASK = 'todo:edit-task'

export interface NewTaskDetail {
  dueDate?: string
}

export const openNewTask = (detail: NewTaskDetail = {}) =>
  window.dispatchEvent(new CustomEvent<NewTaskDetail>(NEW_TASK, { detail }))

export const openEditTask = (task: Task) => window.dispatchEvent(new CustomEvent<Task>(EDIT_TASK, { detail: task }))
