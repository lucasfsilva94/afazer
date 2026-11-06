export type Theme = 'claro' | 'escuro'

const KEY = 'theme'

export function getStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'claro' || v === 'escuro' ? v : null
  } catch {
    return null
  }
}

/** Preferência salva; sem ela, segue o sistema. */
export function resolveTheme(): Theme {
  const stored = getStoredTheme()
  if (stored) return stored
  const dark = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
  return dark ? 'escuro' : 'claro'
}

export function applyTheme(t: Theme): void {
  document.documentElement.dataset.theme = t
}

export function setTheme(t: Theme): void {
  applyTheme(t)
  try {
    localStorage.setItem(KEY, t)
  } catch {
    // simplified: sem armazenamento a escolha vale só nesta sessão
  }
}

export function toggleTheme(): Theme {
  const next: Theme = document.documentElement.dataset.theme === 'escuro' ? 'claro' : 'escuro'
  setTheme(next)
  return next
}
