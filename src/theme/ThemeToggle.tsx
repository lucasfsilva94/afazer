import { useState } from 'react'
import { Icon } from '../ui/Icon'
import { toggleTheme, type Theme } from './theme'

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(
    () => (document.documentElement.dataset.theme === 'escuro' ? 'escuro' : 'claro'),
  )
  return (
    <button
      type="button"
      className="icon-btn"
      data-testid="theme-toggle"
      aria-label="Alternar tema claro e escuro"
      title={theme === 'escuro' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
      onClick={() => setThemeState(toggleTheme())}
    >
      <Icon name={theme === 'escuro' ? 'sun' : 'moon'} size={20} />
    </button>
  )
}
