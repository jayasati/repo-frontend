import { cn }            from '@/lib/utils/cn'
import type { ReactNode } from 'react'

interface CardProps {
  children:  ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-bg-surface border border-border',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('px-6 py-5 border-b border-border', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: CardProps) {
  return (
    <div className={cn('px-6 py-5', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-border', className)}>
      {children}
    </div>
  )
}
