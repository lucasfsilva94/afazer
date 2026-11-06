import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/schema'
import { ThemeToggle } from '../theme/ThemeToggle'
import { Icon, type IconName } from './Icon'
import { Modal } from './Modal'
import { openNewTask } from './actions'

export interface NavItem {
  key: string // pasta em features/
  path: string
  label: string
  icon: IconName
}

export const NAV: NavItem[] = [
  { key: 'dashboard', path: '/', label: 'Painel', icon: 'home' },
  { key: 'tasks', path: '/tarefas', label: 'Tarefas', icon: 'list' },
  { key: 'calendar', path: '/calendario', label: 'Calendário', icon: 'cal' },
  { key: 'projects', path: '/projetos', label: 'Projetos', icon: 'folder' },
  { key: 'history', path: '/historico', label: 'Histórico', icon: 'history' },
  { key: 'stats', path: '/estatisticas', label: 'Estatísticas', icon: 'chart' },
]
const MAIN = NAV.slice(0, 4)
const MORE = NAV.slice(4)

const Logo = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="9" fill="var(--accent)" />
    <path d="M9 16.5l4.8 4.8L23 11.5" fill="none" stroke="var(--accent-fg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Layout() {
  const { pathname } = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const title = NAV.find((n) => n.path === pathname)?.label ?? 'Afazer'
  const pending = useLiveQuery(() => db.tasks.filter((t) => !t.done).count(), [], 0)
  const h1 = useRef<HTMLHeadingElement>(null)

  // Ao trocar de tela, o foco vai para o título (leitores de tela anunciam a mudança).
  useEffect(() => {
    h1.current?.focus({ preventScroll: true })
    setMoreOpen(false)
  }, [pathname])

  return (
    <div className="app">
      <aside className="sidebar" aria-label="Navegação principal">
        <div className="brand">
          <Logo size={32} />
          <span>Afazer</span>
        </div>
        <nav className="nav">
          {NAV.map((n) => (
            <NavLink key={n.path} to={n.path} end>
              <Icon name={n.icon} size={20} />
              <span className="nav-label">{n.label}</span>
              {n.key === 'tasks' && pending > 0 && <span className="badge">{pending}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">Seus dados ficam só neste dispositivo.</div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="brand-mini" aria-hidden="true">
            <Logo size={28} />
          </div>
          <h1 ref={h1} tabIndex={-1}>
            {title}
          </h1>
          <ThemeToggle />
          <button type="button" className="btn btn-primary btn-new" aria-label="Nova tarefa" data-testid="new-task" onClick={() => openNewTask()}>
            <Icon name="plus" />
            <span className="btn-txt">Nova tarefa</span>
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>

      <nav className="bottomnav" aria-label="Navegação principal">
        {MAIN.map((n) => (
          <NavLink key={n.path} to={n.path} end>
            <span className="nav-ind">
              <Icon name={n.icon} size={24} />
            </span>
            {n.label}
          </NavLink>
        ))}
        <button type="button" aria-current={MORE.some((n) => n.path === pathname) ? 'page' : undefined} onClick={() => setMoreOpen(true)}>
          <span className="nav-ind">
            <Icon name="more" size={24} />
          </span>
          Mais
        </button>
      </nav>

      <Modal open={moreOpen} onClose={() => setMoreOpen(false)} labelledBy="more-title" small>
        <div className="dlg-head">
          <h2 id="more-title">Mais telas</h2>
          <button type="button" className="icon-btn" aria-label="Fechar" onClick={() => setMoreOpen(false)}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="more-menu">
          {MORE.map((n) => (
            <NavLink key={n.path} to={n.path} className="more-link" onClick={() => setMoreOpen(false)}>
              <Icon name={n.icon} size={20} />
              {n.label}
            </NavLink>
          ))}
        </div>
      </Modal>
    </div>
  )
}
