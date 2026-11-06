import { Button } from './Button'
import { Modal } from './Modal'

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Excluir',
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Modal open={open} onClose={onCancel} labelledBy="confirm-title" small>
      <div className="dlg-head">
        <h2 id="confirm-title">{title}</h2>
      </div>
      <div className="dlg-body">
        <p>{message}</p>
      </div>
      <div className="dlg-foot">
        {/* Foco inicial em Cancelar: a ação destrutiva exige um gesto deliberado. */}
        <Button data-autofocus onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" data-testid="confirm-delete" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
