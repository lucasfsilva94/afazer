import { db } from './schema'
import { newId, tx } from './repo'
import { updateTask } from './tasks'
import { reminderAt } from '../domain/dates'
import type { Reminder, Task } from './types'

export class ReminderNeedsDueError extends Error {
  constructor() {
    super('Defina um prazo para usar o lembrete.')
    this.name = 'ReminderNeedsDueError'
  }
}

export async function setDue(id: string, dueDate: string | null, dueTime: string | null = null): Promise<Task> {
  const t = await db.tasks.get(id)
  if (!t) throw new Error('Tarefa não encontrada.')
  return updateTask(id, { dueDate, dueTime: dueDate ? dueTime : null }, t.updatedAt)
}

/** Um lembrete por tarefa, em minutos antes do prazo. Exige prazo. */
export function setReminder(taskId: string, minutesBefore: number): Promise<Reminder> {
  return tx(async () => {
    const t = await db.tasks.get(taskId)
    if (!t?.dueDate) throw new ReminderNeedsDueError()
    await db.reminders.where('taskId').equals(taskId).delete()
    const r: Reminder = {
      id: newId(),
      taskId,
      minutesBefore,
      at: reminderAt(t.dueDate, t.dueTime, minutesBefore),
      firedAt: null,
    }
    await db.reminders.add(r)
    return r
  })
}

export async function clearReminder(taskId: string): Promise<void> {
  await db.reminders.where('taskId').equals(taskId).delete()
}

export function getReminder(taskId: string): Promise<Reminder | undefined> {
  return db.reminders.where('taskId').equals(taskId).first()
}
