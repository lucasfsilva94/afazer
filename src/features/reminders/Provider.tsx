import { useEffect, type ReactNode } from 'react'
import { dueLabel } from '../../domain/dates'
import { useToast } from '../../ui/Toast'
import { openEditTask } from '../../ui/actions'
import { startScheduler } from './scheduler'

/** Roda o agendador e mostra o lembrete como toast fixo, com ação "Abrir". */
export default function RemindersProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  useEffect(
    () =>
      startScheduler(({ task }) =>
        toast.show(task.title, {
          sub: `Lembrete${task.dueDate ? ` · ${dueLabel(task.dueDate, task.dueTime)}` : ''}`,
          sticky: true,
          action: { label: 'Abrir', onClick: () => openEditTask(task) },
        }),
      ),
    [toast],
  )
  return <>{children}</>
}
