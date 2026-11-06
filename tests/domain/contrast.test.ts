import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Auditoria de contraste (WCAG 2.1 AA) lida direto dos tokens de theme.css.
const css = readFileSync('src/theme/theme.css', 'utf8')

const block = (selector: string) => {
  const m = css.match(new RegExp(`${selector.replace(/[[\]"]/g, '\\$&')}\\s*\\{([^}]*)\\}`))
  if (!m) throw new Error(`bloco não encontrado: ${selector}`)
  return Object.fromEntries([...m[1].matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((x) => [x[1], x[2]]))
}
const themes = { claro: block(':root, [data-theme="claro"]'), escuro: block('[data-theme="escuro"]') }

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// [primeiro plano, fundo, mínimo]: 4,5 para texto, 3 para bordas de campo.
const PAIRS: [string, string, number][] = [
  ['text', 'bg', 4.5],
  ['text', 'surface', 4.5],
  ['text', 'surface-2', 4.5],
  ['muted', 'bg', 4.5],
  ['muted', 'surface', 4.5],
  ['muted', 'surface-2', 4.5],
  ['accent-text', 'surface', 4.5],
  ['accent-text', 'accent-soft', 4.5],
  ['accent-fg', 'accent', 4.5],
  ['danger', 'surface', 4.5],
  ['danger', 'danger-soft', 4.5],
  ['danger-btn-fg', 'danger-btn', 4.5],
  ['warn-text', 'warn-soft', 4.5],
  ['line-strong', 'surface', 3],
  ['accent', 'surface', 3],
]

describe.each(Object.entries(themes))('contraste no tema %s', (_name, t) => {
  it.each(PAIRS)('%s sobre %s ≥ %s:1', (fg, bg, min) => {
    expect(ratio(t[fg], t[bg])).toBeGreaterThanOrEqual(min)
  })
})
