import { useEffect, useRef, type ReactNode } from 'react'

/**
 * `<dialog>` nativo. O conteúdo só existe enquanto aberto, então o estado interno
 * recomeça a cada abertura. O foco inicial vai para `[data-autofocus]` ou o primeiro campo.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  small,
  children,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  small?: boolean
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      d.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    } else if (!open && d.open) {
      d.close()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      className={`dlg${small ? ' sm' : ''}`}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      {open ? children : null}
    </dialog>
  )
}
