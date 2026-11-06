export type Priority = 'alta' | 'media' | 'baixa'
export type Freq = 'diaria' | 'semanal' | 'mensal'
export type GroupKind = 'project' | 'category' | 'tag'
export type ActivityType = 'criada' | 'concluida' | 'reaberta' | 'editada' | 'excluida'

export interface Recurrence {
  freq: Freq
  interval: number
  until: string | null
}

export interface Task {
  id: string
  title: string
  description: string
  done: boolean
  priority: Priority | null
  dueDate: string | null // YYYY-MM-DD, dia local
  dueTime: string | null // HH:mm, só vale com dueDate
  categoryId: string | null
  tagIds: string[]
  projectId: string | null
  recurrence: Recurrence | null
  createdAt: number
  completedAt: number | null
  updatedAt: number
}

/** Campos que a pessoa edita. `done` só muda por setDone. */
export type TaskFields = Omit<Task, 'id' | 'done' | 'createdAt' | 'completedAt' | 'updatedAt'>

export interface Subtask {
  id: string
  taskId: string
  title: string
  done: boolean
  order: number
}

export interface Reminder {
  id: string
  taskId: string
  at: number
  minutesBefore: number
  firedAt: number | null
}

export interface Group {
  id: string
  name: string
  color: string | null
}

export interface Activity {
  id: string
  at: number
  type: ActivityType
  taskId: string
  taskTitle: string
}
