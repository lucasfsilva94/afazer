import { useRef, useState, type FormEvent } from 'react'
import { createTask } from '../../db/tasks'
import { InvalidTitleError } from '../../db/repo'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { useToast } from '../../ui/Toast'

/** Captura rápida: só o título é obrigatório (FR-028). Enter também envia. */
export function QuickAdd() {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const toast = useToast()

  async function submit(e: FormEvent) {
    e.preventDefault()
    try {
      await createTask({ title })
      setTitle('')
      setError('')
      toast.show('Tarefa adicionada')
    } catch (err) {
      setError(err instanceof InvalidTitleError ? err.message : 'Não foi possível adicionar a tarefa.')
    }
    input.current?.focus()
  }

  return (
    <form className="capture" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor="quick-add">
        Nova tarefa
      </label>
      <div className="capture-row">
        <input
          id="quick-add"
          ref={input}
          className="input"
          data-testid="quick-add-input"
          placeholder="O que precisa ser feito?"
          autoComplete="off"
          maxLength={140}
          value={title}
          aria-invalid={error ? true : undefined}
          aria-describedby="quick-add-error"
          onChange={(e) => {
            setTitle(e.target.value)
            setError('')
          }}
        />
        <Button type="submit" variant="primary" data-testid="quick-add-submit">
          <Icon name="plus" />
          Adicionar
        </Button>
      </div>
      <div className="err" id="quick-add-error" role="alert" data-testid="quick-add-error" hidden={!error}>
        <Icon name="alert" size={16} />
        {error}
      </div>
    </form>
  )
}
