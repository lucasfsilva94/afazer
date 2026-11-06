import type { ComponentType } from 'react'
import type { Recurrence, Task, TaskFields } from '../../db/types'

/** Rascunho do diálogo. `extra` guarda o que não é campo da tarefa (lembrete, subtarefas). */
export interface Draft extends TaskFields {
  extra: Record<string, unknown>
}

export interface SectionProps {
  draft: Draft
  task: Task | null
  errors: Record<string, string>
  set(patch: Partial<TaskFields>): void
  setExtra(key: string, value: unknown): void
}

/** Contrato dos arquivos de `sections/*.tsx` (export `section`). */
export interface TaskSection {
  order: number
  /** Sempre visível no diálogo. */
  Component?: ComponentType<SectionProps>
  /** Dentro de "Mais opções". */
  More?: ComponentType<SectionProps>
  /** Carrega o que a seção precisa de uma tarefa existente. */
  load?(task: Task): Promise<Record<string, unknown>>
  /** Erros por chave de campo; vazio quando válido. */
  validate?(draft: Draft): Record<string, string>
  /** Depois de salvar a tarefa. `initial` é o `extra` carregado ao abrir. */
  onSaved?(task: Task, draft: Draft, initial: Record<string, unknown>): Promise<void>
}

/** Contrato dos arquivos de `chips/*.tsx` (export `chip`). */
export interface TaskChip {
  order: number
  Component: ComponentType<{ task: Task }>
}

/** Contrato dos arquivos de `toolbar/*.tsx` (export `toolbar`). */
export interface TaskToolbar {
  order: number
  Component: ComponentType
}

export const emptyDraft = (): Draft => ({
  title: '',
  description: '',
  priority: null,
  dueDate: null,
  dueTime: null,
  categoryId: null,
  tagIds: [],
  projectId: null,
  recurrence: null as Recurrence | null,
  extra: {},
})

export const draftFromTask = (t: Task): Draft => ({
  title: t.title,
  description: t.description,
  priority: t.priority,
  dueDate: t.dueDate,
  dueTime: t.dueTime,
  categoryId: t.categoryId,
  tagIds: [...t.tagIds],
  projectId: t.projectId,
  recurrence: t.recurrence,
  extra: {},
})
