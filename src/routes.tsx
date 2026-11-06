import type { ComponentType } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { EmptyState } from './ui/EmptyState'
import { Layout, NAV } from './ui/Layout'

// Cada história acrescenta features/<tela>/Page.tsx; a rota usa o export default.
const pages = import.meta.glob<{ default: ComponentType }>('./features/*/Page.tsx', { eager: true })

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {NAV.map((n) => {
          const Page = pages[`./features/${n.key}/Page.tsx`]?.default
          return (
            <Route
              key={n.path}
              path={n.path}
              element={Page ? <Page /> : <EmptyState icon="sparkle" title="Em breve" text={`A tela "${n.label}" ainda não foi construída.`} />}
            />
          )
        })}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
