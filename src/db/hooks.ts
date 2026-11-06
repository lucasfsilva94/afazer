import type { TodoDB } from './schema'
import type { ActivityType, Task } from './types'

/** O que um gancho recebe. Tudo roda na transação da escrita que o disparou. */
export interface HookCtx {
  db: TodoDB
  now: number
  newId(): string
  log(type: ActivityType, task: Pick<Task, 'id' | 'title'>): Promise<void>
}

type Hook<A extends unknown[]> = (ctx: HookCtx, ...args: A) => Promise<void> | void

/** `prev` é null quando a tarefa acabou de ser criada. */
export const saveHooks: Hook<[task: Task, prev: Task | null]>[] = []
export const doneHooks: Hook<[task: Task, done: boolean]>[] = []
export const deleteHooks: Hook<[task: Task]>[] = []

export const onSave = (fn: (typeof saveHooks)[number]) => void saveHooks.push(fn)
export const onDone = (fn: (typeof doneHooks)[number]) => void doneHooks.push(fn)
export const onDelete = (fn: (typeof deleteHooks)[number]) => void deleteHooks.push(fn)
