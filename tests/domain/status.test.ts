import { describe, expect, it } from 'vitest'
import { isOverdue } from '../../src/domain/status'

const at = (s: string) => new Date(s)
const task = (over: Partial<{ done: boolean; dueDate: string | null; dueTime: string | null }> = {}) => ({
  done: false,
  dueDate: '2026-11-05',
  dueTime: null,
  ...over,
})

describe('isOverdue', () => {
  it('sem horário vale o fim do dia: hoje ainda não está atrasada', () => {
    expect(isOverdue(task(), at('2026-11-05T23:00:00'))).toBe(false)
  })

  it('sem horário, atrasa no dia seguinte', () => {
    expect(isOverdue(task(), at('2026-11-06T00:00:01'))).toBe(true)
  })

  it('com horário, atrasa assim que ele passa', () => {
    const t = task({ dueTime: '09:00' })
    expect(isOverdue(t, at('2026-11-05T08:59:00'))).toBe(false)
    expect(isOverdue(t, at('2026-11-05T09:01:00'))).toBe(true)
  })

  it('concluída nunca atrasa', () => {
    expect(isOverdue(task({ done: true, dueDate: '2020-01-01' }), at('2026-11-05T12:00:00'))).toBe(false)
  })

  it('sem prazo nunca atrasa', () => {
    expect(isOverdue(task({ dueDate: null }), at('2030-01-01T00:00:00'))).toBe(false)
  })
})
