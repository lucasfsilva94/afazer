import { useMemo, useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSearchParams } from 'react-router-dom'
import { useGroups } from '../../../db/groups'
import { db } from '../../../db/schema'
import { applyView, paramsFromSearch } from '../../../domain/view'
import { Button } from '../../../ui/Button'
import { Icon } from '../../../ui/Icon'
import type { TaskToolbar } from '../extension-types'

const FILTER_KEYS = ['q', 'status', 'priority', 'category', 'tag', 'due'] as const

function Select({ id, label, value, onChange, children }: { id: string; label: string; value: string; onChange: (v: string) => void; children: ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select" data-testid={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </div>
  )
}

export const toolbar: TaskToolbar = {
  order: 20,
  Component() {
    const [sp, setSp] = useSearchParams()
    const categories = useGroups('category')
    const tags = useGroups('tag')
    // Aberto por padrão em telas largas, recolhido no celular.
    const [open, setOpen] = useState(() => typeof matchMedia === 'function' && matchMedia('(min-width: 768px)').matches)
    const all = useLiveQuery(() => db.tasks.toArray(), [])
    const params = useMemo(() => paramsFromSearch(sp), [sp])

    const active = FILTER_KEYS.some((k) => sp.get(k))
    const found = active && all ? applyView(all, params).length : null

    const set = (key: string, value: string) => {
      const next = new URLSearchParams(sp)
      if (value && value !== 'todas') next.set(key, value)
      else next.delete(key)
      setSp(next, { replace: true })
    }
    const clear = () => {
      const next = new URLSearchParams(sp)
      FILTER_KEYS.forEach((k) => next.delete(k))
      setSp(next, { replace: true })
    }

    return (
      <div className="filters">
        <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
          <summary>
            <Icon name="filter" /> Filtros
          </summary>
          <div className="grid">
            <Select id="filter-status" label="Estado" value={sp.get('status') ?? 'todas'} onChange={(v) => set('status', v)}>
              <option value="todas">Todas</option>
              <option value="pendentes">Pendentes</option>
              <option value="concluidas">Concluídas</option>
            </Select>
            <Select id="filter-due" label="Prazo" value={sp.get('due') ?? ''} onChange={(v) => set('due', v)}>
              <option value="">Qualquer</option>
              <option value="hoje">Hoje</option>
              <option value="7dias">Próximos 7 dias</option>
              <option value="atrasadas">Atrasadas</option>
              <option value="sem-prazo">Sem prazo</option>
            </Select>
            <Select id="filter-priority" label="Prioridade" value={sp.get('priority') ?? ''} onChange={(v) => set('priority', v)}>
              <option value="">Todas</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </Select>
            <Select id="filter-category" label="Categoria" value={sp.get('category') ?? ''} onChange={(v) => set('category', v)}>
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select id="filter-tag" label="Etiqueta" value={sp.get('tag') ?? ''} onChange={(v) => set('tag', v)}>
              <option value="">Todas</option>
              {tags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>
        </details>
        {found !== null && (
          <div className="result-line" role="status">
            <span>{found === 1 ? '1 tarefa encontrada' : `${found} tarefas encontradas`}</span>
            <Button className="btn-sm" data-testid="filter-clear" onClick={clear}>
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    )
  },
}
