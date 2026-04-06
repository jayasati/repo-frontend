import type { ReactNode } from 'react'
import { cn }             from '@/lib/utils/cn'

interface EmptyStateProps {
  message:    string
  icon?:      ReactNode
  variant?:   'default' | 'success'
  className?: string
}

export function EmptyState({ message, icon, variant = 'default', className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-4 py-3 rounded-lg',
        'border border-border bg-bg-surface',
        'font-mono text-[12px]',
        variant === 'success' ? 'text-accent' : 'text-text-dim',
        className,
      )}
    >
      {icon ?? (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            variant === 'success' ? 'bg-accent' : 'bg-text-dim',
          )}
        />
      )}
      {message}
    </div>
  )
}
