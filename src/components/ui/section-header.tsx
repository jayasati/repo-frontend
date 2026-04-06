import { cn }  from '@/lib/utils/cn'

interface SectionHeaderProps {
  title:      string
  count?:     number
  className?: string
}

export function SectionHeader({ title, count, className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 pb-2.5 mb-3',
        'border-b border-border',
        className,
      )}
    >
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted">
        {title}
      </span>
      {count !== undefined && (
        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-bg-surface2 border border-border text-text-muted">
          {count}
        </span>
      )}
    </div>
  )
}
