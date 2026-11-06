import { useSearchParams } from 'react-router-dom'
import { Icon } from '../../../ui/Icon'
import type { TaskToolbar } from '../extension-types'

export const toolbar: TaskToolbar = {
  order: 10,
  Component() {
    const [sp, setSp] = useSearchParams()
    return (
      <div className="search-row" role="search">
        <div className="field">
          <label htmlFor="search-input">Pesquisar</label>
          <div className="od-row">
            <Icon name="search" size={20} />
            <input
              id="search-input"
              type="search"
              className="input"
              data-testid="search-input"
              placeholder="Título ou descrição"
              autoComplete="off"
              value={sp.get('q') ?? ''}
              onChange={(e) => {
                const next = new URLSearchParams(sp)
                if (e.target.value) next.set('q', e.target.value)
                else next.delete('q')
                setSp(next, { replace: true })
              }}
            />
          </div>
        </div>
      </div>
    )
  },
}
