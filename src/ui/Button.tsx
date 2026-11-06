import type { ButtonHTMLAttributes } from 'react'

type Variant = 'default' | 'primary' | 'danger'

export function Button({
  variant = 'default',
  className = '',
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const v = variant === 'default' ? '' : ` btn-${variant}`
  return <button type={type} className={`btn${v} ${className}`.trim()} {...rest} />
}

/** Botão só com ícone: o rótulo acessível é obrigatório. */
export function IconButton({
  label,
  danger,
  className = '',
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; danger?: boolean }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`icon-btn${danger ? ' danger' : ''} ${className}`.trim()}
      {...rest}
    />
  )
}
