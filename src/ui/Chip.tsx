import type { ReactNode } from 'react'

export type ChipTone = 'default' | 'over' | 'today' | 'p-alta' | 'p-media' | 'p-baixa'

/** Chip de metadados. Nunca é só cor: sempre leva texto, e ícone quando o tom tem significado. */
export function Chip({
  tone = 'default',
  testId,
  children,
  title,
}: {
  tone?: ChipTone
  testId?: string
  title?: string
  children: ReactNode
}) {
  return (
    <span className={`chip${tone === 'default' ? '' : ` ${tone}`}`} data-testid={testId} title={title}>
      {children}
    </span>
  )
}
