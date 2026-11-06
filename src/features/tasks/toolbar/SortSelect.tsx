import { useSearchParams } from 'react-router-dom'
import type { TaskToolbar } from '../extension-types'

export const toolbar: TaskToolbar = {
  order: 30,
  Component() {
    const [sp, setSp] = useSearchParams()
    return (
      <div className="field sort-field">
        <label htmlFor="sort-select">Ordenar por</label>
        <select
          id="sort-select"
          className="select"
          data-testid="sort-select"
          value={sp.get('sort') ?? 'recentes'}
          onChange={(e) => {
            const next = new URLSearchParams(sp)
            next.set('sort', e.target.value)
            setSp(next, { replace: true })
          }}
        >
          <option value="recentes">Mais recentes</option>
          <option value="prazo">Prazo</option>
          <option value="prioridade">Prioridade</option>
        </select>
      </div>
    )
  },
}
