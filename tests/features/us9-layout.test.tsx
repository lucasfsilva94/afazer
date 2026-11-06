import { readFileSync } from 'node:fs'
import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { Layout } from '../../src/ui/Layout'

afterEach(cleanup)

describe('menu inferior e reserva do selo (spec 005)', () => {
  it('mostra Painel, Tarefas, Calendário, Projetos e Mais, nessa ordem', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>,
    )
    const navs = screen.getAllByRole('navigation', { name: 'Navegação principal' })
    const bottom = navs.find((n) => n.classList.contains('bottomnav'))!
    const labels = [...bottom.querySelectorAll('a, button')].map((el) => el.textContent?.trim())
    expect(labels).toEqual(['Painel', 'Tarefas', 'Calendário', 'Projetos', 'Mais'])
    expect(within(bottom).getAllByRole('link')).toHaveLength(4)
  })

  it('o token --badge-h é 0 por padrão e só vira 56px com html[data-badge]', () => {
    const css = readFileSync('src/theme/theme.css', 'utf8')
    expect(css).toMatch(/--badge-h:\s*0px/)
    expect(css).toMatch(/html\[data-badge\]\s*\{\s*--badge-h:\s*56px/)
  })

  it('main.tsx marca data-badge só em produção', () => {
    const main = readFileSync('src/main.tsx', 'utf8')
    expect(main).toMatch(/import\.meta\.env\.PROD[^\n]*data-badge/)
  })
})
