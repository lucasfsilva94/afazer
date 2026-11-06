import { db } from '../../db/schema'
import { tx } from '../../db/repo'
import type { Reminder, Task } from '../../db/types'

export interface Fired {
  reminder: Reminder
  task: Task
}

/**
 * Dispara uma vez cada lembrete vencido de tarefa pendente (FR-009, FR-010).
 * Lembrete de tarefa concluída ou excluída é só encerrado, sem aviso.
 */
export function checkReminders(now: number = Date.now()): Promise<Fired[]> {
  return tx(async () => {
    const due = await db.reminders
      .where('at')
      .belowOrEqual(now)
      .filter((r) => r.firedAt === null)
      .toArray()
    const fired: Fired[] = []
    for (const r of due) {
      const task = await db.tasks.get(r.taskId)
      await db.reminders.update(r.id, { firedAt: now })
      if (task && !task.done) fired.push({ reminder: { ...r, firedAt: now }, task })
    }
    return fired
  })
}

export const CHECK_EVERY_MS = 15_000 // SC-005: tolerância de 1 minuto

/** Verifica a cada 15 s e ao voltar o foco (abas em segundo plano atrasam timers). */
export function startScheduler(onFire: (f: Fired) => void, everyMs: number = CHECK_EVERY_MS): () => void {
  let stopped = false
  const run = () => {
    if (stopped) return
    void checkReminders().then((list) => list.forEach(onFire))
  }
  const onVisible = () => {
    if (document.visibilityState === 'visible') run()
  }
  const timer = setInterval(run, everyMs)
  window.addEventListener('focus', run)
  document.addEventListener('visibilitychange', onVisible)
  run()
  return () => {
    stopped = true
    clearInterval(timer)
    window.removeEventListener('focus', run)
    document.removeEventListener('visibilitychange', onVisible)
  }
}
