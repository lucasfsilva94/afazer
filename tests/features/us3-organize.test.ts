import { describe, expect, it } from 'vitest'
import { db } from '../../src/db/schema'
import { DuplicateNameError } from '../../src/db/repo'
import { createGroup, deleteGroup, renameGroup } from '../../src/db/groups'
import { createTask, updateTask } from '../../src/db/tasks'
import { applyView } from '../../src/domain/view'

describe('US3 — prioridade, categorias e etiquetas', () => {
  it('altera a prioridade e ordena das mais importantes para as menos', async () => {
    const a = await createTask({ title: 'sem' })
    const b = await createTask({ title: 'baixa', priority: 'baixa' })
    const c = await createTask({ title: 'alta' })
    await updateTask(c.id, { priority: 'alta' }, c.updatedAt)
    const m = await createTask({ title: 'media', priority: 'media' })
    const all = await db.tasks.toArray()
    const sorted = applyView(all, { sort: 'prioridade' }).map((t) => t.title)
    expect(sorted).toEqual(['alta', 'media', 'baixa', 'sem'])
    expect([a, b, m].length).toBe(3)
  })

  it('nome único sem diferenciar maiúsculas, por tabela', async () => {
    await createGroup('category', 'Trabalho')
    await expect(createGroup('category', 'trabalho')).rejects.toBeInstanceOf(DuplicateNameError)
    await expect(createGroup('tag', 'Trabalho')).resolves.toMatchObject({ name: 'Trabalho' })
  })

  it('renomear mantém as tarefas associadas (só o id está nelas)', async () => {
    const g = await createGroup('project', 'Casa')
    const t = await createTask({ title: 'x', projectId: g.id })
    await renameGroup('project', g.id, 'Lar')
    expect((await db.projects.get(g.id))!.name).toBe('Lar')
    expect((await db.tasks.get(t.id))!.projectId).toBe(g.id)
  })

  it('excluir grupo em uso desassocia sem apagar tarefas e devolve a contagem (FR-014)', async () => {
    const cat = await createGroup('category', 'Estudos')
    const tag = await createGroup('tag', 'urgente')
    const other = await createGroup('tag', 'outra')
    const t1 = await createTask({ title: '1', categoryId: cat.id, tagIds: [tag.id, other.id] })
    const t2 = await createTask({ title: '2', categoryId: cat.id })

    expect(await deleteGroup('category', cat.id)).toEqual({ detachedTasks: 2 })
    expect(await deleteGroup('tag', tag.id)).toEqual({ detachedTasks: 1 })

    expect(await db.tasks.count()).toBe(2)
    expect((await db.tasks.get(t1.id))!.categoryId).toBeNull()
    expect((await db.tasks.get(t1.id))!.tagIds).toEqual([other.id])
    expect((await db.tasks.get(t2.id))!.categoryId).toBeNull()
    expect(await db.categories.get(cat.id)).toBeUndefined()
  })
})
