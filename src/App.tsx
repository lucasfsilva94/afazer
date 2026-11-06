import type { ComponentType, ReactNode } from 'react'
import { HashRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { ToastProvider } from './ui/Toast'

// Cada história pode acrescentar features/<nome>/Provider.tsx, montado em volta das rotas.
const modules = import.meta.glob<{ default: ComponentType<{ children: ReactNode }> }>('./features/*/Provider.tsx', { eager: true })
const providers = Object.keys(modules)
  .sort()
  .map((k) => modules[k].default)

export default function App() {
  return (
    <ToastProvider>
      <HashRouter>
        {providers.reduceRight<ReactNode>((child, P) => <P>{child}</P>, <AppRoutes />)}
      </HashRouter>
    </ToastProvider>
  )
}
