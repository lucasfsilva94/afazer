import { useLiveQuery } from 'dexie-react-hooks'
import type { Table } from 'dexie'
import { db } from './schema'
import { DuplicateNameError, InvalidTitleError, newId, tx } from './repo'
import type { Group, GroupKind } from './types'

export const KIND_LABEL: Record<GroupKind, { one: string; many: string }> = {
  project: { one: 'projeto', many: 'Projetos' },
  category: { one: 'categoria', many: 'Categorias' },
  tag: { one: 'etiqueta', many: 'Etiquetas' },
}

// Cores de categoria do design (o nome sempre acompanha o ponto).
const COLORS = ['#2F6FDE', '#B4487A', '#7A5BD8', '#C27A12', '#0F8A5F', '#C0392B']

const table = (kind: GroupKind): Table<Group, string> =>
  kind === 'project' ? db.projects : kind === 'category' ? db.categories : db.tags

const clean = (raw: string) => {
  const name = raw.trim()
  if (!name) throw new InvalidTitleError('Informe um nome.')
  return name
}

async function assertUnique(kind: GroupKind, name: string, exceptId?: string) {
  const key = name.toLowerCase()
  const clash = await table(kind)
    .filter((g) => g.id !== exceptId && g.name.toLowerCase() === key)
    .first()
  if (clash) throw new DuplicateNameError(`Já existe ${kind === 'tag' ? 'uma etiqueta' : kind === 'project' ? 'um projeto' : 'uma categoria'} chamada “${clash.name}”.`)
}

export async function createGroup(kind: GroupKind, rawName: string): Promise<Group> {
  const name = clean(rawName)
  return tx(async () => {
    await assertUnique(kind, name)
    const g: Group = { id: newId(), name, color: COLORS[(await table(kind).count()) % COLORS.length] }
    await table(kind).add(g)
    return g
  })
}

export async function renameGroup(kind: GroupKind, id: string, rawName: string): Promise<void> {
  const name = clean(rawName)
  await tx(async () => {
    await assertUnique(kind, name, id)
    await table(kind).update(id, { name })
  })
}

const usersOf = (kind: GroupKind, id: string) =>
  db.tasks.where(kind === 'project' ? 'projectId' : kind === 'category' ? 'categoryId' : 'tagIds').equals(id)

export const countUsage = (kind: GroupKind, id: string): Promise<number> => usersOf(kind, id).count()

/** Remove o grupo e desassocia as tarefas; elas permanecem (FR-014). */
export function deleteGroup(kind: GroupKind, id: string): Promise<{ detachedTasks: number }> {
  return tx(async () => {
    const now = Date.now()
    const detachedTasks = await usersOf(kind, id).modify((t) => {
      if (kind === 'project') t.projectId = null
      else if (kind === 'category') t.categoryId = null
      else t.tagIds = t.tagIds.filter((x) => x !== id)
      t.updatedAt = Math.max(now, t.updatedAt + 1)
    })
    await table(kind).delete(id)
    return { detachedTasks }
  })
}

/** Grupos de um tipo, por nome. */
export function useGroups(kind: GroupKind): Group[] {
  return (
    useLiveQuery(async () => (await table(kind).toArray()).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')), [kind]) ?? []
  )
}
