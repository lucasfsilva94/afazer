import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { Icon } from './Icon'

export interface ToastOptions {
  sub?: string
  action?: { label: string; onClick: () => void }
  /** Fica até ser dispensado (lembretes). Sem isso, some em 5 s. */
  sticky?: boolean
}

interface ToastItem extends ToastOptions {
  id: number
  message: string
}

interface ToastApi {
  show(message: string, opts?: ToastOptions): void
}

const Ctx = createContext<ToastApi>({ show: () => {} })
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const seq = useRef(0)

  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), [])
  const api = useMemo<ToastApi>(
    () => ({
      show(message, opts = {}) {
        const id = ++seq.current
        setItems((l) => [...l, { id, message, ...opts }])
        if (!opts.sticky) setTimeout(() => dismiss(id), 5000)
      },
    }),
    [dismiss],
  )

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast${t.sticky ? ' reminder' : ''}`} data-testid="toast">
            <div className="tm">
              {t.message}
              {t.sub && <small>{t.sub}</small>}
            </div>
            {t.action && (
              <button
                type="button"
                className="ta"
                onClick={() => {
                  t.action!.onClick()
                  dismiss(t.id)
                }}
              >
                {t.action.label}
              </button>
            )}
            <button type="button" className="icon-btn" aria-label="Dispensar aviso" onClick={() => dismiss(t.id)}>
              <Icon name="x" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
