import type { Task } from '../db/types'

/** Parâmetros da visão. Vêm da URL (`paramsFromSearch`) ou de quem chama. */
export interface ViewParams {
  q?: string
  status?: string // todas | pendentes | concluidas
  priority?: string
  category?: string
  tag?: string
  due?: string // hoje | 7dias | atrasadas | sem-prazo
  sort?: string // recentes | prazo | prioridade
  now?: Date
}

export interface ViewStep {
  order: number
  apply(tasks: Task[], params: ViewParams): Task[]
}

const KEYS = ['q', 'status', 'priority', 'category', 'tag', 'due', 'sort'] as const

export function paramsFromSearch(sp: URLSearchParams): ViewParams {
  const p: ViewParams = {}
  for (const k of KEYS) {
    const v = sp.get(k)
    if (v) p[k] = v
  }
  return p
}

// Cada arquivo de `view/` exporta `step`. Ordena por `order` e aplica em sequência.
const modules = import.meta.glob<{ step: ViewStep }>('./view/*.ts', { eager: true })
const steps: ViewStep[] = Object.values(modules)
  .map((m) => m.step)
  .filter(Boolean)
  .sort((a, b) => a.order - b.order)

export function applyView(tasks: Task[], params: ViewParams = {}): Task[] {
  return steps.reduce((list, s) => s.apply(list, params), tasks)
}
