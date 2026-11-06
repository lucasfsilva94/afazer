import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

export function EmptyState({
  icon = 'inbox',
  title,
  text,
  children,
}: {
  icon?: IconName
  title: string
  text?: string
  children?: ReactNode
}) {
  return (
    <div className="empty" data-testid="empty-state">
      <Icon name={icon} size={36} />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  )
}
