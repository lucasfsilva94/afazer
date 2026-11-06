import { onDone } from '../hooks'
import { reminderAt, todayStr } from '../../domain/dates'
import { nextOccurrence } from '../../domain/recurrence'
import type { Task } from '../types'

// Concluir uma tarefa recorrente cria a próxima ocorrência na mesma transação (FR-017).
// Reabrir não apaga a que já foi criada. Se a próxima data passou de `until`, não cria nada.
onDone(async ({ db, now, newId, log }, task, done) => {
  if (!done || !task.recurrence || !task.dueDate) return
  // Concluída com atraso: avança para a próxima data que ainda não passou.
  const dueDate = nextOccurrence(task.dueDate, task.recurrence, todayStr(new Date(now)))
  if (!dueDate) return

  const next: Task = { ...task, id: newId(), done: false, completedAt: null, createdAt: now, updatedAt: now, dueDate }
  await db.tasks.add(next)
  await log('criada', next)

  const subs = await db.subtasks.where('taskId').equals(task.id).toArray()
  await db.subtasks.bulkAdd(subs.map((s) => ({ ...s, id: newId(), taskId: next.id, done: false })))

  // O lembrete acompanha a regra. Roda antes do gancho de lembretes, que encerra o da ocorrência concluída.
  const reminder = await db.reminders.where('taskId').equals(task.id).first()
  if (reminder) {
    await db.reminders.add({
      id: newId(),
      taskId: next.id,
      minutesBefore: reminder.minutesBefore,
      at: reminderAt(dueDate, next.dueTime, reminder.minutesBefore),
      firedAt: null,
    })
  }
})
