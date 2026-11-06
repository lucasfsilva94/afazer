import { describe, expect, it } from 'vitest'
import { db } from '../../src/db/schema'
import { clearReminder, ReminderNeedsDueError, setDue, setReminder } from '../../src/db/schedule'
import { createTask, deleteTask, setDone } from '../../src/db/tasks'
import { reminderAt } from '../../src/domain/dates'
import { checkReminders } from '../../src/features/reminders/scheduler'

const make = () => createTask({ title: 'Reunião', dueDate: '2030-01-10', dueTime: '10:00' })

describe('US2 — prazo, horário e lembrete', () => {
  it('lembrete exige prazo', async () => {
    const t = await createTask({ title: 'Sem prazo' })
    await expect(setReminder(t.id, 15)).rejects.toBeInstanceOf(ReminderNeedsDueError)
  })

  it('dispara uma vez, no momento certo', async () => {
    const t = await make()
    const r = await setReminder(t.id, 15)
    expect(r.at).toBe(reminderAt('2030-01-10', '10:00', 15))
    expect(await checkReminders(r.at - 1)).toEqual([])
    const fired = await checkReminders(r.at)
    expect(fired.map((f) => f.task.id)).toEqual([t.id])
    expect(await checkReminders(r.at + 60_000)).toEqual([])
  })

  it('sem horário o prazo conta como 09:00', async () => {
    const t = await createTask({ title: 'Dia todo', dueDate: '2030-01-10' })
    const r = await setReminder(t.id, 0)
    expect(r.at).toBe(reminderAt('2030-01-10', null, 0))
    expect(new Date(r.at).getHours()).toBe(9)
  })

  it('não dispara se a tarefa foi concluída (FR-010)', async () => {
    const t = await make()
    const r = await setReminder(t.id, 0)
    await setDone(t.id, true)
    expect(await checkReminders(r.at + 1000)).toEqual([])
  })

  it('não dispara se a tarefa foi excluída, e o lembrete some', async () => {
    const t = await make()
    const r = await setReminder(t.id, 0)
    await deleteTask(t.id)
    expect(await db.reminders.count()).toBe(0)
    expect(await checkReminders(r.at + 1000)).toEqual([])
  })

  it('não dispara se o lembrete foi removido', async () => {
    const t = await make()
    const r = await setReminder(t.id, 0)
    await clearReminder(t.id)
    expect(await checkReminders(r.at + 1000)).toEqual([])
  })

  it('recalcula `at` e rearma quando o prazo muda', async () => {
    const t = await make()
    const r = await setReminder(t.id, 15)
    await checkReminders(r.at)
    await setDue(t.id, '2030-02-01', '14:00')
    const after = (await db.reminders.get(r.id))!
    expect(after.at).toBe(reminderAt('2030-02-01', '14:00', 15))
    expect(after.firedAt).toBeNull()
  })

  it('remover o prazo remove o lembrete', async () => {
    const t = await make()
    await setReminder(t.id, 15)
    await setDue(t.id, null)
    expect(await db.reminders.count()).toBe(0)
    expect((await db.tasks.get(t.id))!.dueTime).toBeNull()
  })
})
