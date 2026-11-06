import { onDelete, onDone, onSave } from '../hooks'
import { reminderAt } from '../../domain/dates'

// Salvar: sem prazo não há lembrete; prazo novo recalcula `at` e rearma o aviso.
onSave(async ({ db }, task, prev) => {
  if (!task.dueDate) {
    await db.reminders.where('taskId').equals(task.id).delete()
    return
  }
  if (prev && prev.dueDate === task.dueDate && prev.dueTime === task.dueTime) return
  const due = task.dueDate
  await db.reminders
    .where('taskId')
    .equals(task.id)
    .modify((r) => {
      r.at = reminderAt(due, task.dueTime, r.minutesBefore)
      r.firedAt = null
    })
})

// Concluir encerra os lembretes pendentes (FR-010).
onDone(async ({ db, now }, task, done) => {
  if (!done) return
  await db.reminders
    .where('taskId')
    .equals(task.id)
    .filter((r) => r.firedAt === null)
    .modify({ firedAt: now })
})

// Excluir apaga os lembretes da tarefa.
onDelete(async ({ db }, task) => {
  await db.reminders.where('taskId').equals(task.id).delete()
})
