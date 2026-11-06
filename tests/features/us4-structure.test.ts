import { describe, expect, it } from 'vitest'
import { db } from '../../src/db/schema'
import { addSubtask, listSubtasks, saveSubtasks, setSubtaskDone } from '../../src/db/structure'
import { setReminder } from '../../src/db/schedule'
import { createTask, deleteTask, setDone } from '../../src/db/tasks'
import { subtaskProgress } from '../../src/domain/progress'

const weekly = { freq: 'semanal', interval: 1, until: null } as const

describe('US4 — subtarefas, projetos e recorrência', () => {
  it('progresso reflete as subtarefas concluídas', async () => {
    const t = await createTask({ title: 'Mudança' })
    const a = await addSubtask(t.id, 'Caixas')
    await addSubtask(t.id, 'Transporte')
    expect(subtaskProgress(await listSubtasks(t.id))).toEqual({ done: 0, total: 2 })
    await setSubtaskDone(a.id, true)
    expect(subtaskProgress(await listSubtasks(t.id))).toEqual({ done: 1, total: 2 })
    expect(subtaskProgress([])).toEqual({ done: 0, total: 0 })
  })

  it('concluir todas as subtarefas não conclui a tarefa', async () => {
    const t = await createTask({ title: 'X' })
    const s = await addSubtask(t.id, 'a')
    await setSubtaskDone(s.id, true)
    expect((await db.tasks.get(t.id))!.done).toBe(false)
  })

  it('saveSubtasks remove, cria e reordena', async () => {
    const t = await createTask({ title: 'X' })
    const a = await addSubtask(t.id, 'a')
    const b = await addSubtask(t.id, 'b')
    await saveSubtasks(t.id, [
      { id: b.id, title: 'b', done: true },
      { id: 'novo', title: 'c', done: false },
    ])
    const list = await listSubtasks(t.id)
    expect(list.map((s) => [s.id, s.title, s.done])).toEqual([[b.id, 'b', true], ['novo', 'c', false]])
    expect(await db.subtasks.get(a.id)).toBeUndefined()
  })

  it('concluir recorrente cria a próxima ocorrência com subtarefas reabertas', async () => {
    const t = await createTask({ title: 'Regar', dueDate: '2030-01-10', dueTime: '08:00', recurrence: weekly, priority: 'alta' })
    const s = await addSubtask(t.id, 'Samambaia')
    await setSubtaskDone(s.id, true)

    await setDone(t.id, true)

    const all = await db.tasks.toArray()
    expect(all).toHaveLength(2)
    const next = all.find((x) => x.id !== t.id)!
    expect(next).toMatchObject({ title: 'Regar', dueDate: '2030-01-17', dueTime: '08:00', done: false, priority: 'alta', completedAt: null })
    expect(next.recurrence).toEqual(weekly)
    const subs = await listSubtasks(next.id)
    expect(subs.map((x) => [x.title, x.done])).toEqual([['Samambaia', false]])
    expect((await listSubtasks(t.id))[0].done).toBe(true)
  })

  it('a próxima ocorrência herda o lembrete', async () => {
    const t = await createTask({ title: 'R', dueDate: '2030-01-10', dueTime: '10:00', recurrence: weekly })
    await setReminder(t.id, 15)
    await setDone(t.id, true)
    const next = (await db.tasks.toArray()).find((x) => x.id !== t.id)!
    const r = await db.reminders.where('taskId').equals(next.id).first()
    expect(r).toMatchObject({ minutesBefore: 15, firedAt: null })
  })

  it('reabrir não apaga a ocorrência criada', async () => {
    const t = await createTask({ title: 'R', dueDate: '2030-01-10', recurrence: weekly })
    await setDone(t.id, true)
    await setDone(t.id, false)
    expect(await db.tasks.count()).toBe(2)
  })

  it('não cria nova ocorrência depois de `until`', async () => {
    const t = await createTask({ title: 'R', dueDate: '2030-01-10', recurrence: { ...weekly, until: '2030-01-12' } })
    await setDone(t.id, true)
    expect(await db.tasks.count()).toBe(1)
  })

  it('sem recorrência, concluir não cria nada', async () => {
    const t = await createTask({ title: 'R', dueDate: '2030-01-10' })
    await setDone(t.id, true)
    expect(await db.tasks.count()).toBe(1)
  })

  it('excluir a tarefa remove as subtarefas', async () => {
    const t = await createTask({ title: 'X' })
    await addSubtask(t.id, 'a')
    await addSubtask(t.id, 'b')
    await deleteTask(t.id)
    expect(await db.subtasks.count()).toBe(0)
  })
})
