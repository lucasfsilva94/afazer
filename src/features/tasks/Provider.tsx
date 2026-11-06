import type { ReactNode } from 'react'
import { TaskDialogHost } from './TaskDialog'

/** Monta o diálogo de tarefa uma vez, para todas as telas. */
export default function TasksProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <TaskDialogHost />
    </>
  )
}
