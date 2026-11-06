import type { Task } from '../db/types'
import { todayStr } from './dates'
import { isOverdue } from './status'

export interface DashboardGroups {
  overdue: Task[]
  today: Task[]
  pending: Task[]
}

/**
 * Atrasadas: pendentes com prazo vencido. Hoje: prazo hoje que não atrasou (concluídas incluídas).
 * Pendentes: as demais abertas. Cada tarefa cai em um grupo só.
 */
export function groupForDashboard(tasks: Task[], now: Date = new Date()): DashboardGroups {
  const today = todayStr(now)
  const g: DashboardGroups = { overdue: [], today: [], pending: [] }
  for (const t of tasks) {
    if (isOverdue(t, now)) g.overdue.push(t)
    else if (t.dueDate === today) g.today.push(t)
    else if (!t.done) g.pending.push(t)
  }
  return g
}

/** Progresso do dia: concluídas sobre previstas para hoje (inclui as que já atrasaram). */
export function todayProgress(tasks: Task[], now: Date = new Date()): { done: number; total: number } {
  const today = todayStr(now)
  const due = tasks.filter((t) => t.dueDate === today)
  return { done: due.filter((t) => t.done).length, total: due.length }
}
