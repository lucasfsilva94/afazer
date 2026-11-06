import { db } from './schema'
import { cleanTitle, newId, tx } from './repo'
import type { Subtask } from './types'

export const listSubtasks = async (taskId: string): Promise<Subtask[]> =>
  (await db.subtasks.where('taskId').equals(taskId).toArray()).sort((a, b) => a.order - b.order)

export async function addSubtask(taskId: string, rawTitle: string): Promise<Subtask> {
  const title = cleanTitle(rawTitle)
  return tx(async () => {
    const order = await db.subtasks.where('taskId').equals(taskId).count()
    const s: Subtask = { id: newId(), taskId, title, done: false, order }
    await db.subtasks.add(s)
    return s
  })
}

/** Concluir todas as subtarefas não conclui a tarefa: a pessoa decide. */
export async function setSubtaskDone(id: string, done: boolean): Promise<void> {
  await db.subtasks.update(id, { done })
}

export async function deleteSubtask(id: string): Promise<void> {
  await db.subtasks.delete(id)
}

/** Move uma posição para cima (-1) ou para baixo (+1) dentro da tarefa. */
export function moveSubtask(id: string, delta: -1 | 1): Promise<void> {
  return tx(async () => {
    const s = await db.subtasks.get(id)
    if (!s) return
    const list = await listSubtasks(s.taskId)
    const i = list.findIndex((x) => x.id === id)
    const j = i + delta
    if (j < 0 || j >= list.length) return
    ;[list[i], list[j]] = [list[j], list[i]]
    await db.subtasks.bulkPut(list.map((x, order) => ({ ...x, order })))
  })
}

export interface SubtaskDraft {
  id: string
  title: string
  done: boolean
}

/** Grava a lista inteira do diálogo: remove as que saíram, cria e reordena as demais. */
export function saveSubtasks(taskId: string, items: SubtaskDraft[]): Promise<void> {
  return tx(async () => {
    const keep = new Set(items.map((i) => i.id))
    const old = await db.subtasks.where('taskId').equals(taskId).primaryKeys()
    await db.subtasks.bulkDelete(old.filter((id) => !keep.has(id)))
    await db.subtasks.bulkPut(items.map((i, order) => ({ id: i.id, taskId, title: cleanTitle(i.title), done: i.done, order })))
  })
}
