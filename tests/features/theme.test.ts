import { createElement } from 'react'
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyTheme, getStoredTheme, resolveTheme, setTheme, toggleTheme } from '../../src/theme/theme'
import { ThemeToggle } from '../../src/theme/ThemeToggle'

const html = document.documentElement

const stubSystem = (dark: boolean) =>
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: dark && q.includes('dark'), media: q, addEventListener() {}, removeEventListener() {} }))

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  delete html.dataset.theme
})

describe('tema (FR-025, SC-007)', () => {
  it('sem preferência salva, segue o sistema', () => {
    stubSystem(true)
    expect(getStoredTheme()).toBeNull()
    expect(resolveTheme()).toBe('escuro')
    stubSystem(false)
    expect(resolveTheme()).toBe('claro')
  })

  it('alternar muda o tema na hora e grava a preferência', () => {
    applyTheme('claro')
    expect(toggleTheme()).toBe('escuro')
    expect(html.dataset.theme).toBe('escuro')
    expect(localStorage.getItem('theme')).toBe('escuro')
    expect(toggleTheme()).toBe('claro')
    expect(html.dataset.theme).toBe('claro')
  })

  it('a preferência vale na próxima abertura, mesmo contra o sistema', () => {
    stubSystem(false)
    setTheme('escuro')
    delete html.dataset.theme // "fecha" a página
    applyTheme(resolveTheme()) // "reabre"
    expect(html.dataset.theme).toBe('escuro')
  })

  it('valor inválido guardado é ignorado', () => {
    localStorage.setItem('theme', 'azul')
    expect(getStoredTheme()).toBeNull()
  })

  it('o botão do cabeçalho alterna e persiste', () => {
    applyTheme('claro')
    render(createElement(ThemeToggle))
    const btn = screen.getByTestId('theme-toggle')
    act(() => btn.click())
    expect(html.dataset.theme).toBe('escuro')
    expect(localStorage.getItem('theme')).toBe('escuro')
    act(() => btn.click())
    expect(html.dataset.theme).toBe('claro')
  })
})
