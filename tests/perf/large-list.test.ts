import { createElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { db } from '../../src/db/schema'
import type { Task } from '../../src/db/types'
import { groupForDashboard } from '../../src/domain/dashboard'
import { applyView } from '../../src/domain/view'
import { completedPerDay } from '../../src/domain/stats'
import { TaskList } from '../../src/features/tasks/TaskList'
import { ToastProvider } from '../../src/ui/Toast'

const N = 500
const NOW = new Date('2026-11-15T12:00:00')

const seed = async () => {
  const tasks: Task[] = Array.from({ length: N }, (_, i) => ({
    id: `id${i}`,
    title: `Tarefa ${i}`,
    description: i % 4 ? '' : `detalhe ${i}`,
    done: i % 5 === 0,
    priority: (['alta', 'media', 'baixa', null] as const)[i % 4],
    dueDate: `2026-11-${String((i % 28) + 1).padStart(2, '0')}`,
    dueTime: null,
    categoryId: `c${i % 5}`,
    tagIds: i % 3 ? [] : ['g1'],
    projectId: null,
    recurrence: null,
    createdAt: 1_700_000_000_000 + i,
    completedAt: i % 5 === 0 ? 1_700_000_000_000 + i : null,
    updatedAt: 1_700_000_000_000 + i,
  }))
  await db.tasks.bulkAdd(tasks)
  return tasks
}

const timed = async <T>(fn: () => T | Promise<T>) => {
  const t0 = performance.now()
  const out = await fn()
  return { out, ms: performance.now() - t0 }
}

afterEach(cleanup)

describe(`desempenho com ${N} tarefas (SC-004, SC-008)`, () => {
  it('lê, pesquisa e filtra em menos de 1 s', async () => {
    await seed()
    const { out, ms } = await timed(async () => {
      const all = await db.tasks.toArray()
      return applyView(all, { q: 'tarefa 4', category: 'c4', priority: 'alta', sort: 'prazo', now: NOW })
    })
    expect(out.length).toBeGreaterThan(0)
    expect(ms).toBeLessThan(1000)
  })

  it('o calendário lê um mês pelo índice de prazo em menos de 1 s', async () => {
    await seed()
    const { out, ms } = await timed(() => db.tasks.where('dueDate').between('2026-10-25', '2026-12-05', true, true).toArray())
    expect(out.length).toBe(N)
    expect(ms).toBeLessThan(1000)
  })

  it('painel e estatísticas calculam em menos de 1 s', async () => {
    const tasks = await seed()
    const { ms } = await timed(() => {
      groupForDashboard(tasks, NOW)
      completedPerDay(tasks, NOW)
    })
    expect(ms).toBeLessThan(1000)
  })

  it('a lista renderiza só 50 linhas e oferece "Mostrar mais" (FR-027)', async () => {
    await seed()
    render(createElement(MemoryRouter, null, createElement(ToastProvider, null, createElement(TaskList))))
    await waitFor(() => expect(screen.getAllByTestId('task-row').length).toBeGreaterThan(0), { timeout: 5000 })
    // pendentes: 400 -> 50 na tela; concluídas: 100 -> 50 na tela
    expect(screen.getAllByTestId('task-row')).toHaveLength(100)
    expect(screen.getAllByText(/Mostrar mais/)).toHaveLength(2)
  })
})
