import { describe, expect, it } from 'vitest'
import type { Recurrence } from '../../src/db/types'
import { nextOccurrence } from '../../src/domain/recurrence'

const rule = (freq: Recurrence['freq'], interval = 1, until: string | null = null): Recurrence => ({ freq, interval, until })

describe('nextOccurrence', () => {
  it('diária', () => {
    expect(nextOccurrence('2026-01-10', rule('diaria'))).toBe('2026-01-11')
    expect(nextOccurrence('2026-12-31', rule('diaria'))).toBe('2027-01-01')
  })

  it('semanal', () => {
    expect(nextOccurrence('2026-01-10', rule('semanal'))).toBe('2026-01-17')
  })

  it('mensal comum', () => {
    expect(nextOccurrence('2026-01-15', rule('mensal'))).toBe('2026-02-15')
    expect(nextOccurrence('2026-12-15', rule('mensal'))).toBe('2027-01-15')
  })

  it('mensal em dia 31 usa o último dia do mês curto', () => {
    expect(nextOccurrence('2026-01-31', rule('mensal'))).toBe('2026-02-28')
    expect(nextOccurrence('2028-01-31', rule('mensal'))).toBe('2028-02-29')
    expect(nextOccurrence('2026-03-31', rule('mensal'))).toBe('2026-04-30')
  })

  it('respeita intervalo maior que 1', () => {
    expect(nextOccurrence('2026-01-10', rule('diaria', 3))).toBe('2026-01-13')
    expect(nextOccurrence('2026-01-10', rule('semanal', 2))).toBe('2026-01-24')
    expect(nextOccurrence('2026-01-31', rule('mensal', 2))).toBe('2026-03-31')
  })

  it('devolve null ao passar de `until`, e aceita a própria data final', () => {
    expect(nextOccurrence('2026-01-10', rule('diaria', 1, '2026-01-10'))).toBeNull()
    expect(nextOccurrence('2026-01-10', rule('diaria', 1, '2026-01-11'))).toBe('2026-01-11')
    expect(nextOccurrence('2026-01-10', rule('semanal', 1, '2026-01-16'))).toBeNull()
  })

  it('com `notBefore` pula datas passadas sem escorregar o dia', () => {
    expect(nextOccurrence('2026-01-10', rule('diaria'), '2026-01-20')).toBe('2026-01-20')
    expect(nextOccurrence('2026-01-31', rule('mensal'), '2026-03-01')).toBe('2026-03-31')
    expect(nextOccurrence('2026-01-10', rule('diaria', 1, '2026-01-15'), '2026-01-20')).toBeNull()
  })
})
