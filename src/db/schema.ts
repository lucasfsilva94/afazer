import Dexie, { type Table } from 'dexie'
import type { Activity, Group, Reminder, Subtask, Task } from './types'

export class TodoDB extends Dexie {
  tasks!: Table<Task, string>
  subtasks!: Table<Subtask, string>
  reminders!: Table<Reminder, string>
  projects!: Table<Group, string>
  categories!: Table<Group, string>
  tags!: Table<Group, string>
  activity!: Table<Activity, string>

  constructor(name = 'todo-app') {
    super(name)
    this.version(1).stores({
      tasks: 'id, dueDate, done, projectId, categoryId, *tagIds, completedAt',
      subtasks: 'id, taskId',
      reminders: 'id, taskId, at',
      projects: 'id, name',
      categories: 'id, name',
      tags: 'id, name',
      activity: 'id, at',
    })
  }
}

export const db = new TodoDB()
