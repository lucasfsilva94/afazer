import { describe, expect, it } from 'vitest'
import type { Task } from '../../src/db/types'
import { applyView, paramsFromSearch } from '../../src/domain/view'

const NOW = new Date('2026-11-05T14:00:00')
let n = 0
const mk = (over: Partial<Task>): Task => ({
  id: `t${++n}`,
  title: `tarefa ${n}`,
  description: '',
  done: false,
  priority: null,
  dueDate: null,
  dueTime: null,
  categoryId: null,
  tagIds: [],
  projectId: null,
  recurrence: null,
  createdAt: n,
  completedAt: null,
  updatedAt: n,
  ...over,
})
const titles = (l: Task[]) => l.map((t) => t.title).sort()

const set = [
  mk({ title: 'Comprar pão', description: 'padaria da esquina', categoryId: 'c1', priority: 'alta', tagIds: ['g1'] }),
  mk({ title: 'Ligar para o banco', categoryId: 'c1', priority: 'baixa', done: true }),
  mk({ title: 'Reunião', description: 'preparar AÇÃO do time', categoryId: 'c2', priority: 'alta', dueDate: '2026-11-05' }),
  mk({ title: 'Relatório', dueDate: '2026-11-01', tagIds: ['g1', 'g2'] }),
  mk({ title: 'Viagem', dueDate: '2026-11-10' }),
  mk({ title: 'Longe', dueDate: '2026-12-25' }),
]

describe('busca (FR-020)', () => {
  it('acha em título e em descrição, sem diferenciar caixa nem acento', () => {
    expect(titles(applyView(set, { q: 'pao' }))).toEqual(['Comprar pão'])
    expect(titles(applyView(set, { q: 'PADARIA' }))).toEqual(['Comprar pão'])
    expect(titles(applyView(set, { q: 'acao' }))).toEqual(['Reunião'])
  })

  it('termo sem resultado devolve lista vazia', () => {
    expect(applyView(set, { q: 'zzz' })).toEqual([])
  })
})

describe('filtros (FR-021)', () => {
  it('um filtro por vez', () => {
    expect(titles(applyView(set, { category: 'c1' }))).toEqual(['Comprar pão', 'Ligar para o banco'])
    expect(titles(applyView(set, { tag: 'g2' }))).toEqual(['Relatório'])
    expect(titles(applyView(set, { priority: 'alta' }))).toEqual(['Comprar pão', 'Reunião'])
    expect(titles(applyView(set, { status: 'concluidas' }))).toEqual(['Ligar para o banco'])
    expect(applyView(set, { status: 'pendentes' })).toHaveLength(5)
  })

  it('prazo: hoje, 7 dias, atrasadas, sem prazo', () => {
    expect(titles(applyView(set, { due: 'hoje', now: NOW }))).toEqual(['Reunião'])
    expect(titles(applyView(set, { due: '7dias', now: NOW }))).toEqual(['Reunião', 'Viagem'])
    expect(titles(applyView(set, { due: 'atrasadas', now: NOW }))).toEqual(['Relatório'])
    expect(titles(applyView(set, { due: 'sem-prazo', now: NOW }))).toEqual(['Comprar pão', 'Ligar para o banco'])
  })

  it('combinados: só quem satisfaz todos', () => {
    expect(titles(applyView(set, { category: 'c1', priority: 'alta' }))).toEqual(['Comprar pão'])
    expect(titles(applyView(set, { category: 'c1', priority: 'alta', status: 'concluidas' }))).toEqual([])
    expect(titles(applyView(set, { q: 'pão', tag: 'g1' }))).toEqual(['Comprar pão'])
  })

  it('limpar filtros devolve tudo', () => {
    expect(applyView(set, {})).toHaveLength(set.length)
    expect(applyView(set, paramsFromSearch(new URLSearchParams('')))).toHaveLength(set.length)
  })

  it('lê os parâmetros da URL', () => {
    const p = paramsFromSearch(new URLSearchParams('q=pao&category=c1&priority=alta&sort=prazo&x=1'))
    expect(p).toEqual({ q: 'pao', category: 'c1', priority: 'alta', sort: 'prazo' })
    expect(titles(applyView(set, p))).toEqual(['Comprar pão'])
  })
})

describe('desempenho (SC-004)', () => {
  it('busca + filtros em 500 tarefas leva menos de 1 s', () => {
    const big = Array.from({ length: 500 }, (_, i) =>
      mk({ title: `Tarefa número ${i}`, description: `descrição ${i % 7}`, categoryId: `c${i % 5}`, priority: i % 3 ? 'media' : 'alta', dueDate: '2026-11-05' }),
    )
    const t0 = performance.now()
    const out = applyView(big, { q: 'numero 4', category: 'c4', priority: 'media', due: 'hoje', sort: 'prioridade', now: NOW })
    expect(performance.now() - t0).toBeLessThan(1000)
    expect(out.length).toBeGreaterThan(0)
  })
})
