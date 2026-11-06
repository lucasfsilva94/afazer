import type { Task } from '../db/types'
import { addDays, todayStr, weekStart, ymd } from './dates'

export interface Bucket {
  /** Dia (YYYY-MM-DD) ou domingo da semana. */
  key: string
  count: number
}

const completedDay = (t: Task): string | null => (t.done && t.completedAt ? ymd(new Date(t.completedAt)) : null)

/** Concluídas por dia nos últimos `days` dias, do mais antigo ao de hoje. */
export function completedPerDay(tasks: Task[], now: Date = new Date(), days = 14): Bucket[] {
  const today = todayStr(now)
  const counts = new Map<string, number>()
  for (const t of tasks) {
    const d = completedDay(t)
    if (d) counts.set(d, (counts.get(d) ?? 0) + 1)
  }
  return Array.from({ length: days }, (_, i) => {
    const key = addDays(today, i - (days - 1))
    return { key, count: counts.get(key) ?? 0 }
  })
}

/** Concluídas por semana (domingo a sábado) nas últimas `weeks` semanas, a atual por último. */
export function completedPerWeek(tasks: Task[], now: Date = new Date(), weeks = 8): Bucket[] {
  const thisWeek = weekStart(todayStr(now))
  const counts = new Map<string, number>()
  for (const t of tasks) {
    const d = completedDay(t)
    if (d) counts.set(weekStart(d), (counts.get(weekStart(d)) ?? 0) + 1)
  }
  return Array.from({ length: weeks }, (_, i) => {
    const key = addDays(thisWeek, (i - (weeks - 1)) * 7)
    return { key, count: counts.get(key) ?? 0 }
  })
}

/** Concluídas sobre o total de tarefas. `rate` é null quando não há tarefas (nada a inventar). */
export function completionRate(tasks: Task[]): { done: number; total: number; rate: number | null } {
  const done = tasks.filter((t) => t.done).length
  return { done, total: tasks.length, rate: tasks.length ? done / tasks.length : null }
}
