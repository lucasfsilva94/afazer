import type { Recurrence } from '../db/types'
import { addDays, addMonths } from './dates'

const MAX_STEPS = 10_000

/**
 * Próxima data da regra depois de `dueDate`, ou null se passar de `until`.
 * Cada data sai da data base com k*intervalo (e não da anterior), então mensal em dia
 * 31 não "escorrega" para 28 depois de passar por fevereiro.
 * Com `notBefore`, pula as datas anteriores a ela (ocorrência concluída com atraso).
 */
export function nextOccurrence(dueDate: string, r: Recurrence, notBefore?: string): string | null {
  const step = Math.max(1, Math.floor(r.interval) || 1)
  for (let k = 1; k <= MAX_STEPS; k++) {
    const next =
      r.freq === 'diaria' ? addDays(dueDate, k * step) : r.freq === 'semanal' ? addDays(dueDate, 7 * k * step) : addMonths(dueDate, k * step)
    if (r.until && next > r.until) return null
    if (!notBefore || next >= notBefore) return next
  }
  return null
}
