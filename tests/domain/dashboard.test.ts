import { describe, expect, it } from 'vitest'
import type { Task } from '../../src/db/types'
import { groupForDashboard, todayProgress } from '../../src/domain/dashboard'

const NOW = new Date('2026-11-05T14:00:00')

let n = 0
const mk = (over: Partial<Task>): Task => ({
  id: `t${++n}`,
  title: `t${n}`,
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

const ids = (l: Task[]) => l.map((t) => t.title).sort()

describe('groupForDashboard', () => {
  const tasks = [
    mk({ title: 'hoje-aberta', dueDate: '2026-11-05' }),
    mk({ title: 'hoje-feita', dueDate: '2026-11-05', done: true }),
    mk({ title: 'hoje-passou-hora', dueDate: '2026-11-05', dueTime: '09:00' }),
    mk({ title: 'ontem', dueDate: '2026-11-04' }),
    mk({ title: 'ontem-feita', dueDate: '2026-11-04', done: true }),
    mk({ title: 'amanha', dueDate: '2026-11-06' }),
    mk({ title: 'sem-prazo' }),
  ]
  const g = groupForDashboard(tasks, NOW)

  it('atrasadas: pendentes com prazo vencido (inclui hoje com horário passado)', () => {
    expect(ids(g.overdue)).toEqual(['hoje-passou-hora', 'ontem'])
  })

  it('hoje: prazo hoje que ainda não atrasou, concluídas incluídas', () => {
    expect(ids(g.today)).toEqual(['hoje-aberta', 'hoje-feita'])
  })

  it('pendentes: o resto das abertas, sem repetir as de hoje nem as atrasadas', () => {
    expect(ids(g.pending)).toEqual(['amanha', 'sem-prazo'])
  })

  it('concluídas de dias passados não aparecem em lugar nenhum', () => {
    const all = [...g.overdue, ...g.today, ...g.pending].map((t) => t.title)
    expect(all).not.toContain('ontem-feita')
  })
})

describe('todayProgress', () => {
  it('concluídas sobre previstas para hoje (FR-019)', () => {
    const t = [
      mk({ dueDate: '2026-11-05', done: true }),
      mk({ dueDate: '2026-11-05' }),
      mk({ dueDate: '2026-11-05', dueTime: '09:00' }),
      mk({ dueDate: '2026-11-06', done: true }),
    ]
    expect(todayProgress(t, NOW)).toEqual({ done: 1, total: 3 })
  })

  it('atualiza ao concluir mais uma', () => {
    const a = mk({ dueDate: '2026-11-05' })
    const b = mk({ dueDate: '2026-11-05' })
    expect(todayProgress([a, b], NOW)).toEqual({ done: 0, total: 2 })
    expect(todayProgress([{ ...a, done: true }, b], NOW)).toEqual({ done: 1, total: 2 })
  })

  it('sem tarefas para hoje: 0 de 0', () => {
    expect(todayProgress([mk({ dueDate: '2026-11-06' })], NOW)).toEqual({ done: 0, total: 0 })
  })
})
