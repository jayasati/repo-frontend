import { cn }          from '@/lib/utils/cn'
import type { Hotspot } from '@/types/analysis.types'

interface HotspotItemProps {
  hotspot: Hotspot
}

const riskBorder = { high: 'border-l-ra-red', medium: 'border-l-ra-amber', low: 'border-l-text-dim' }
const riskBadge  = {
  high:   'bg-ra-red-dim   text-ra-red   border-ra-red/40',
  medium: 'bg-ra-amber-dim text-ra-amber border-ra-amber/40',
  low:    'bg-bg-surface2  text-text-dim border-border',
}

export function HotspotItem({ hotspot }: HotspotItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 bg-bg-surface border border-border rounded-lg px-3 py-2.5',
        'border-l-[3px]',
        riskBorder[hotspot.risk],
      )}
    >
      <span
        className={cn(
          'flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-[0.06em] border',
          riskBadge[hotspot.risk],
        )}
      >
        {hotspot.risk}
      </span>
      <span className="font-mono text-[13px] text-text flex-1 truncate">
        {hotspot.module}
      </span>
      <span className="font-mono text-[11px] text-text-muted flex-shrink-0">
        fan-out: {hotspot.fanOut}
      </span>
    </div>
  )
}
