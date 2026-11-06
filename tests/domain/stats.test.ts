import { describe, expect, it } from 'vitest'
import type { Task } from '../../src/db/types'
import { completedPerDay, completedPerWeek, completionRate } from '../../src/domain/stats'

// Quinta-feira, 5 nov 2026.
const NOW = new Date('2026-11-05T15:00:00')
const at = (s: string) => new Date(s).getTime()

let n = 0
const mk = (completed?: string): Task => ({
  id: `t${++n}`,
  title: `t${n}`,
  description: '',
  done: !!completed,
  priority: null,
  dueDate: null,
  dueTime: null,
  categoryId: null,
  tagIds: [],
  projectId: null,
  recurrence: null,
  createdAt: n,
  completedAt: completed ? at(completed) : null,
  updatedAt: n,
})

const tasks = [
  mk('2026-11-05T09:00:00'),
  mk('2026-11-05T11:00:00'),
  mk('2026-11-04T23:59:00'),
  mk('2026-11-01T10:00:00'), // domingo da semana atual
  mk('2026-10-31T10:00:00'), // sábado da semana anterior
  mk('2026-10-01T10:00:00'), // fora dos 14 dias
  mk(),
  mk(),
]

describe('completedPerDay', () => {
  const days = completedPerDay(tasks, NOW, 14)

  it('cobre os últimos 14 dias, do mais antigo ao de hoje', () => {
    expect(days).toHaveLength(14)
    expect(days[0].key).toBe('2026-10-23')
    expect(days[13].key).toBe('2026-11-05')
  })

  it('conta pelo dia local de conclusão', () => {
    const get = (k: string) => days.find((d) => d.key === k)!.count
    expect(get('2026-11-05')).toBe(2)
    expect(get('2026-11-04')).toBe(1)
    expect(get('2026-11-03')).toBe(0)
    expect(get('2026-10-31')).toBe(1)
  })

  it('ignora o que está fora da janela', () => {
    expect(days.reduce((s, d) => s + d.count, 0)).toBe(5)
  })
})

describe('completedPerWeek', () => {
  const weeks = completedPerWeek(tasks, NOW, 8)

  it('semanas de domingo a sábado, a atual por último', () => {
    expect(weeks).toHaveLength(8)
    expect(weeks[7].key).toBe('2026-11-01')
    expect(weeks[6].key).toBe('2026-10-25')
  })

  it('soma por semana', () => {
    expect(weeks[7].count).toBe(4) // 5/11 ×2, 4/11, 1/11
    expect(weeks[6].count).toBe(1) // 31/10
  })
})

describe('completionRate', () => {
  it('concluídas sobre o total', () => {
    expect(completionRate(tasks)).toEqual({ done: 6, total: 8, rate: 0.75 })
  })

  it('sem tarefas não inventa percentual', () => {
    expect(completionRate([])).toEqual({ done: 0, total: 0, rate: null })
  })
})
