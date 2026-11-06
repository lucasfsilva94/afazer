import { useState } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import { Modal } from './Modal'

/**
 * Pede um nome. `onSubmit` pode lançar para mostrar o erro ao lado do campo
 * (nome vazio ou duplicado).
 */
export function NameDialog({
  open,
  title,
  label = 'Nome',
  initial = '',
  onSubmit,
  onCancel,
}: {
  open: boolean
  title: string
  label?: string
  initial?: string
  onSubmit: (name: string) => Promise<void> | void
  onCancel: () => void
}) {
  return (
    <Modal open={open} onClose={onCancel} labelledBy="name-title" small>
      <NameForm title={title} label={label} initial={initial} onSubmit={onSubmit} onCancel={onCancel} />
    </Modal>
  )
}

function NameForm({
  title,
  label,
  initial,
  onSubmit,
  onCancel,
}: {
  title: string
  label: string
  initial: string
  onSubmit: (name: string) => Promise<void> | void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial)
  const [error, setError] = useState('')

  async function submit() {
    try {
      await onSubmit(name)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível salvar.')
    }
  }

  return (
    <>
      <div className="dlg-head">
        <h2 id="name-title">{title}</h2>
      </div>
      <div className="dlg-body">
        <div className="field">
          <label htmlFor="name-input">{label}</label>
          <input
            id="name-input"
            className="input"
            data-autofocus
            data-testid="name-input"
            maxLength={40}
            autoComplete="off"
            value={name}
            aria-invalid={error ? true : undefined}
            aria-describedby="name-err"
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                void submit()
              }
            }}
          />
          <div className="err" id="name-err" role="alert" hidden={!error}>
            <Icon name="alert" size={16} />
            {error}
          </div>
        </div>
      </div>
      <div className="dlg-foot">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" data-testid="name-submit" onClick={() => void submit()}>
          Salvar
        </Button>
      </div>
    </>
  )
}
