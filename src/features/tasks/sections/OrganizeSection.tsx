import { useGroups } from '../../../db/groups'
import type { Priority } from '../../../db/types'
import type { TaskSection } from '../extension-types'

export const section: TaskSection = {
  order: 20,

  Component({ draft, set }) {
    return (
      <div className="field">
        <label htmlFor="f-prio">Prioridade</label>
        <select
          id="f-prio"
          className="select"
          data-testid="task-form-priority"
          value={draft.priority ?? ''}
          onChange={(e) => set({ priority: (e.target.value || null) as Priority | null })}
        >
          <option value="">Sem prioridade</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
      </div>
    )
  },

  More({ draft, set }) {
    const categories = useGroups('category')
    const tags = useGroups('tag')
    return (
      <>
        <div className="field">
          <label htmlFor="f-cat">Categoria</label>
          <select
            id="f-cat"
            className="select"
            data-testid="task-form-category"
            value={draft.categoryId ?? ''}
            onChange={(e) => set({ categoryId: e.target.value || null })}
          >
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <span className="lbl" id="f-tags-l">
            Etiquetas
          </span>
          {tags.length === 0 ? (
            <p className="help">Nenhuma etiqueta ainda. Crie etiquetas na tela Projetos.</p>
          ) : (
            <div className="tagpick" role="group" aria-labelledby="f-tags-l">
              {tags.map((t) => (
                <label key={t.id}>
                  <input
                    type="checkbox"
                    data-testid="task-form-tag"
                    checked={draft.tagIds.includes(t.id)}
                    onChange={(e) =>
                      set({ tagIds: e.target.checked ? [...draft.tagIds, t.id] : draft.tagIds.filter((x) => x !== t.id) })
                    }
                  />
                  {t.name}
                </label>
              ))}
            </div>
          )}
        </div>
      </>
    )
  },
}
