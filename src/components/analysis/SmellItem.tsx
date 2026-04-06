import { cn }                  from '@/lib/utils/cn'
import type { ArchitectureSmell } from '@/types/analysis.types'

interface SmellItemProps {
  smell: ArchitectureSmell
}

const severityBorder = {
  high:   'border-l-ra-red',
  medium: 'border-l-ra-amber',
  low:    'border-l-text-dim',
}

const severityBadge = {
  high:   'bg-ra-red-dim text-ra-red border-ra-red/40',
  medium: 'bg-ra-amber-dim text-ra-amber border-ra-amber/40',
  low:    'bg-bg-surface2 text-text-dim border-border',
}

export function SmellItem({ smell }: SmellItemProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 bg-bg-surface border border-border rounded-lg px-3 py-2.5',
        'border-l-[3px]',
        severityBorder[smell.severity],
      )}
    >
      <span
        className={cn(
          'flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-[0.06em] border',
          severityBadge[smell.severity],
        )}
      >
        {smell.severity}
      </span>
      <div className="min-w-0">
        <p className="text-[13px] text-text leading-relaxed">{smell.message}</p>
        <p className="font-mono text-[11px] text-text-dim mt-0.5">{smell.type}</p>
      </div>
    </div>
  )
}
