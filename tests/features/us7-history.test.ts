import { describe, expect, it } from 'vitest'
import { db } from '../../src/db/schema'
import { createTask, deleteTask, setDone, updateTask } from '../../src/db/tasks'

describe('US7 — histórico de atividades', () => {
  it('registra os eventos em ordem cronológica com tipo e título', async () => {
    const t = await createTask({ title: 'Relatório' })
    await setDone(t.id, true)
    await setDone(t.id, false)
    await updateTask(t.id, { description: 'rev' }, (await db.tasks.get(t.id))!.updatedAt)
    await deleteTask(t.id)

    const events = await db.activity.orderBy('at').toArray()
    expect(events.map((e) => e.type)).toEqual(['criada', 'concluida', 'reaberta', 'editada', 'excluida'])
    expect(events.every((e) => e.taskId === t.id)).toBe(true)
    const ats = events.map((e) => e.at)
    expect([...ats].sort((a, b) => a - b)).toEqual(ats)
    expect(new Set(ats).size).toBe(ats.length)
  })

  it('o título continua legível depois que a tarefa é excluída', async () => {
    const t = await createTask({ title: 'Some depois' })
    await deleteTask(t.id)
    expect(await db.tasks.get(t.id)).toBeUndefined()
    const events = await db.activity.orderBy('at').toArray()
    expect(events.map((e) => e.taskTitle)).toEqual(['Some depois', 'Some depois'])
  })

  it('o título do evento é o do momento, mesmo depois de renomear', async () => {
    const t = await createTask({ title: 'Antes' })
    await updateTask(t.id, { title: 'Depois' }, t.updatedAt)
    const events = await db.activity.orderBy('at').toArray()
    expect(events.map((e) => e.taskTitle)).toEqual(['Antes', 'Depois'])
  })
})
