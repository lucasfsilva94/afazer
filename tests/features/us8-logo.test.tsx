import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { Layout } from '../../src/ui/Layout'

afterEach(cleanup)

describe('logo no cabeçalho (FR-007, FR-009, FR-012)', () => {
  it('tem as duas versões, só uma com alt "aFazer"', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/desconhecida']}>
        <Layout />
      </MemoryRouter>,
    )
    const light = container.querySelector('img.logo-light')
    const dark = container.querySelector('img.logo-dark')
    expect(light).not.toBeNull()
    expect(dark).not.toBeNull()
    expect(light!.getAttribute('alt')).toBe('aFazer')
    expect(dark!.getAttribute('alt')).toBe('')
    expect(screen.getAllByAltText('aFazer')).toHaveLength(1)
  })

  it('usa a grafia aFazer e nunca "Afazer"', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/desconhecida']}>
        <Layout />
      </MemoryRouter>,
    )
    expect(container.textContent).not.toContain('Afazer')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('aFazer')
  })
})
