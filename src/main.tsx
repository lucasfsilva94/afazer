import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme/theme.css'
import './ui/ui.css'
import { applyTheme, resolveTheme } from './theme/theme'
import App from './App'

applyTheme(resolveTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
