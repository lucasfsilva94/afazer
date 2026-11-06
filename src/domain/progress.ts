import type { Subtask } from '../db/types'

/** Subtarefas concluídas sobre o total. Sem subtarefas: total 0 (a interface não mostra progresso). */
export function subtaskProgress(subtasks: Pick<Subtask, 'done'>[]): { done: number; total: number } {
  return { done: subtasks.filter((s) => s.done).length, total: subtasks.length }
}
