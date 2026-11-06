import { describe, expect, it } from 'vitest'
import { db } from '../../src/db/schema'
import { InvalidTitleError } from '../../src/db/repo'
import { createTask, deleteTask, setDone, updateTask } from '../../src/db/tasks'

describe('US1 — capturar e concluir tarefas', () => {
  it('rejeita título vazio ou só com espaços (FR-002)', async () => {
    await expect(createTask({ title: '' })).rejects.toBeInstanceOf(InvalidTitleError)
    await expect(createTask({ title: '   ' })).rejects.toBeInstanceOf(InvalidTitleError)
    expect(await db.tasks.count()).toBe(0)
  })

  it('cria com título aparado, pendente, e grava a atividade criada', async () => {
    const t = await createTask({ title: '  Comprar pão  ' })
    expect(t.title).toBe('Comprar pão')
    expect(t.done).toBe(false)
    expect(t.completedAt).toBeNull()
    const acts = await db.activity.orderBy('at').toArray()
    expect(acts.map((a) => [a.type, a.taskId, a.taskTitle])).toEqual([['criada', t.id, 'Comprar pão']])
  })

  it('edita título e descrição, atualiza updatedAt e registra editada', async () => {
    const t = await createTask({ title: 'A' })
    await new Promise((r) => setTimeout(r, 3))
    const u = await updateTask(t.id, { title: 'B', description: 'detalhe' }, t.updatedAt)
    expect(u.title).toBe('B')
    expect(u.description).toBe('detalhe')
    expect(u.updatedAt).toBeGreaterThan(t.updatedAt)
    expect((await db.activity.orderBy('at').toArray()).map((a) => a.type)).toContain('editada')
  })

  it('edição não aceita título vazio', async () => {
    const t = await createTask({ title: 'A' })
    await expect(updateTask(t.id, { title: ' ' }, t.updatedAt)).rejects.toBeInstanceOf(InvalidTitleError)
  })

  it('setDone alterna completedAt e registra concluida/reaberta', async () => {
    const t = await createTask({ title: 'A' })
    await setDone(t.id, true)
    const done = (await db.tasks.get(t.id))!
    expect(done.done).toBe(true)
    expect(done.completedAt).toEqual(expect.any(Number))
    await setDone(t.id, false)
    const open = (await db.tasks.get(t.id))!
    expect(open.done).toBe(false)
    expect(open.completedAt).toBeNull()
    expect((await db.activity.orderBy('at').toArray()).map((a) => a.type)).toEqual(['criada', 'concluida', 'reaberta'])
  })

  it('excluir remove a tarefa e registra excluida com o título', async () => {
    const t = await createTask({ title: 'Apagar' })
    await deleteTask(t.id)
    expect(await db.tasks.get(t.id)).toBeUndefined()
    const last = (await db.activity.orderBy('at').last())!
    expect([last.type, last.taskTitle]).toEqual(['excluida', 'Apagar'])
  })

  it('os dados sobrevivem a fechar e reabrir o banco (SC-002)', async () => {
    const t = await createTask({ title: 'Persistente', priority: 'alta', dueDate: '2026-12-01' })
    db.close()
    await db.open()
    const again = (await db.tasks.get(t.id))!
    expect(again.title).toBe('Persistente')
    expect(again.priority).toBe('alta')
    expect(again.dueDate).toBe('2026-12-01')
  })
})
