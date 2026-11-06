import type { Task } from '../db/types'
import { dueInstant } from './dates'

/**
 * Atrasada é derivada, nunca gravada: pendente com prazo anterior a agora.
 * Sem horário, o prazo vale até o fim do dia.
 */
export function isOverdue(task: Pick<Task, 'done' | 'dueDate' | 'dueTime'>, now: Date = new Date()): boolean {
  if (task.done || !task.dueDate) return false
  return dueInstant(task.dueDate, task.dueTime).getTime() < now.getTime()
}
