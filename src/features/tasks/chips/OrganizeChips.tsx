import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../db/schema'
import type { Priority } from '../../../db/types'
import { Chip } from '../../../ui/Chip'
import { Icon, PrioBars } from '../../../ui/Icon'
import type { TaskChip } from '../extension-types'

const PRIO: Record<Priority, { label: string; level: 1 | 2 | 3 }> = {
  alta: { label: 'Alta', level: 3 },
  media: { label: 'Média', level: 2 },
  baixa: { label: 'Baixa', level: 1 },
}

export const chip: TaskChip = {
  order: 20,
  Component({ task }) {
    const category = useLiveQuery(() => (task.categoryId ? db.categories.get(task.categoryId) : undefined), [task.categoryId])
    const tagKey = task.tagIds.join(',')
    const tags = useLiveQuery(() => db.tags.bulkGet(task.tagIds), [tagKey])
    return (
      <>
        {task.priority && (
          <Chip tone={`p-${task.priority}`} title={`Prioridade ${PRIO[task.priority].label.toLowerCase()}`}>
            <PrioBars level={PRIO[task.priority].level} />
            {PRIO[task.priority].label}
          </Chip>
        )}
        {category && (
          <Chip>
            <span className="dot" style={{ ['--dot' as string]: category.color ?? undefined }} />
            {category.name}
          </Chip>
        )}
        {tags?.map(
          (t) =>
            t && (
              <Chip key={t.id}>
                <Icon name="tag" size={14} />
                {t.name}
              </Chip>
            ),
        )}
      </>
    )
  },
}
