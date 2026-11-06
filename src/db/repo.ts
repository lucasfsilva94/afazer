import { db } from './schema'
import { deleteHooks, doneHooks, saveHooks, type HookCtx } from './hooks'
import type { ActivityType, Task } from './types'

export class InvalidTitleError extends Error {
  constructor(message = 'Informe um título para a tarefa.') {
    super(message)
    this.name = 'InvalidTitleError'
  }
}
export class DuplicateNameError extends Error {
  constructor(message = 'Já existe um item com esse nome.') {
    super(message)
    this.name = 'DuplicateNameError'
  }
}
export class StaleEditError extends Error {
  constructor(message = 'Esta tarefa mudou em outra aba. Recarregue antes de salvar.') {
    super(message)
    this.name = 'StaleEditError'
  }
}

export const newId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

/** Título válido: sem espaços nas pontas e nunca vazio (FR-002). */
export function cleanTitle(raw: unknown): string {
  const t = typeof raw === 'string' ? raw.trim() : ''
  if (!t) throw new InvalidTitleError()
  return t
}

// Instantes de atividade sempre crescem, para o histórico não empatar na mesma milissegundo.
let lastAt = 0
const stamp = () => (lastAt = Math.max(Date.now(), lastAt + 1))

/** Toda escrita roda aqui: a mudança, os ganchos e a atividade ficam na mesma transação. */
export function tx<T>(fn: () => Promise<T>): Promise<T> {
  return db.transaction('rw', db.tables as never, fn) as Promise<T>
}

export async function logActivity(type: ActivityType, task: Pick<Task, 'id' | 'title'>): Promise<void> {
  await db.activity.add({ id: newId(), at: stamp(), type, taskId: task.id, taskTitle: task.title })
}

const hookCtx = (): HookCtx => ({ db, now: Date.now(), newId, log: logActivity })

export async function fireSave(task: Task, prev: Task | null): Promise<void> {
  for (const h of saveHooks) await h(hookCtx(), task, prev)
}
export async function fireDone(task: Task, done: boolean): Promise<void> {
  for (const h of doneHooks) await h(hookCtx(), task, done)
}
export async function fireDelete(task: Task): Promise<void> {
  for (const h of deleteHooks) await h(hookCtx(), task)
}

// Cada história acrescenta um arquivo em `extensions/` que registra seus ganchos.
const extensions = import.meta.glob('./extensions/*.ts', { eager: true })
export const extensionCount = Object.keys(extensions).length
