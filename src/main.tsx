import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme/theme.css'
import './ui/ui.css'
import { applyTheme, resolveTheme } from './theme/theme'
import App from './App'

applyTheme(resolveTheme())
// Em produção o Netlify injeta o selo no canto inferior direito; o CSS reserva uma faixa para ele.
if (import.meta.env.PROD) document.documentElement.setAttribute('data-badge', '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
