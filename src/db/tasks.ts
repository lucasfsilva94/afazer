import { db } from './schema'
import { cleanTitle, fireDelete, fireDone, fireSave, logActivity, newId, StaleEditError, tx } from './repo'
import type { Task, TaskFields } from './types'

const defaults = (): TaskFields => ({
  title: '',
  description: '',
  priority: null,
  dueDate: null,
  dueTime: null,
  categoryId: null,
  tagIds: [],
  projectId: null,
  recurrence: null,
})

/** Horário só vale com data. */
const normalize = <T extends Partial<TaskFields>>(f: T): T =>
  'dueDate' in f && !f.dueDate ? { ...f, dueDate: null, dueTime: null } : f

export async function createTask(input: { title: string } & Partial<TaskFields>): Promise<Task> {
  const title = cleanTitle(input.title)
  return tx(async () => {
    const now = Date.now()
    const task: Task = {
      ...defaults(),
      ...normalize(input),
      title,
      id: newId(),
      done: false,
      createdAt: now,
      completedAt: null,
      updatedAt: now,
    }
    await db.tasks.add(task)
    await logActivity('criada', task)
    await fireSave(task, null)
    return task
  })
}

/** Rejeita se a tarefa mudou desde que o formulário a carregou (outra aba). */
export async function updateTask(id: string, patch: Partial<TaskFields>, loadedUpdatedAt: number): Promise<Task> {
  const title = 'title' in patch ? cleanTitle(patch.title) : undefined
  return tx(async () => {
    const prev = await db.tasks.get(id)
    if (!prev) throw new Error('Tarefa não encontrada.')
    if (prev.updatedAt !== loadedUpdatedAt) throw new StaleEditError()
    const next: Task = {
      ...prev,
      ...normalize(patch),
      ...(title !== undefined && { title }),
      updatedAt: Math.max(Date.now(), prev.updatedAt + 1),
    }
    await db.tasks.put(next)
    await logActivity('editada', next)
    await fireSave(next, prev)
    return next
  })
}

export function setDone(id: string, done: boolean): Promise<void> {
  return tx(async () => {
    const prev = await db.tasks.get(id)
    if (!prev || prev.done === done) return
    const now = Date.now()
    const next: Task = { ...prev, done, completedAt: done ? now : null, updatedAt: Math.max(now, prev.updatedAt + 1) }
    await db.tasks.put(next)
    await logActivity(done ? 'concluida' : 'reaberta', next)
    await fireDone(next, done)
  })
}

export function deleteTask(id: string): Promise<void> {
  return tx(async () => {
    const task = await db.tasks.get(id)
    if (!task) return
    await fireDelete(task)
    await db.tasks.delete(id)
    await logActivity('excluida', task)
  })
}
