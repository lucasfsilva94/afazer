import type { Task } from '../../db/types'
import { addDays, todayStr } from '../dates'
import { isOverdue } from '../status'
import type { ViewStep } from '../view'

/** Minúsculas e sem acento, para "acao" achar "Ação". */
const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Busca em título e descrição + filtros, todos combinados com E lógico (FR-020, FR-021). */
export const step: ViewStep = {
  order: 10,
  apply(tasks, p) {
    const q = fold((p.q ?? '').trim())
    const now = p.now ?? new Date()
    const today = todayStr(now)
    const week = addDays(today, 7)
    const checks: ((t: Task) => boolean)[] = []

    if (q) checks.push((t) => fold(`${t.title}\n${t.description}`).includes(q))
    if (p.status === 'pendentes') checks.push((t) => !t.done)
    if (p.status === 'concluidas') checks.push((t) => t.done)
    if (p.priority) checks.push((t) => t.priority === p.priority)
    if (p.category) checks.push((t) => t.categoryId === p.category)
    if (p.tag) checks.push((t) => t.tagIds.includes(p.tag!))
    if (p.due === 'hoje') checks.push((t) => t.dueDate === today)
    else if (p.due === '7dias') checks.push((t) => !!t.dueDate && t.dueDate >= today && t.dueDate <= week)
    else if (p.due === 'atrasadas') checks.push((t) => isOverdue(t, now))
    else if (p.due === 'sem-prazo') checks.push((t) => !t.dueDate)

    return checks.length ? tasks.filter((t) => checks.every((c) => c(t))) : tasks
  },
}
