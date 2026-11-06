import type { Task } from '../../db/types'
import { dueInstant } from '../dates'
import type { ViewStep } from '../view'

const RANK = { alta: 0, media: 1, baixa: 2 } as const

const byPriority = (a: Task, b: Task) => (a.priority ? RANK[a.priority] : 3) - (b.priority ? RANK[b.priority] : 3)

const dueKey = (t: Task) => (t.dueDate ? dueInstant(t.dueDate, t.dueTime).getTime() : Infinity)

/** Ordenação estável; sem `sort` mantém a ordem recebida. */
export const step: ViewStep = {
  order: 20,
  apply(tasks, { sort }) {
    switch (sort) {
      case 'prioridade':
        return [...tasks].sort(byPriority)
      case 'prazo':
        return [...tasks].sort((a, b) => (dueKey(a) === dueKey(b) ? 0 : dueKey(a) < dueKey(b) ? -1 : 1))
      case 'recentes':
        return [...tasks].sort((a, b) => b.createdAt - a.createdAt)
      default:
        return tasks
    }
  },
}
