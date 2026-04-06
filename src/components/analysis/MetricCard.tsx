import { cn } from '@/lib/utils/cn'

interface MetricCardProps {
  label:     string
  value:     number | string
  unit?:     string
  highlight?: 'green' | 'amber' | 'red'
}

const highlightColors = {
  green: 'text-accent',
  amber: 'text-ra-amber',
  red:   'text-ra-red',
}

/**
 * MetricCard — compact stat tile.
 * Used in the metrics grid: modules, deps, cycles, avg fan-in, avg fan-out, density, max fan-out.
 */
export function MetricCard({ label, value, unit, highlight }: MetricCardProps) {
  return (
    <div className="bg-bg-surface2 rounded-lg p-3 text-center">
      <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.06em] mb-1.5">
        {label}
      </p>
      <p
        className={cn(
          'font-mono text-[18px] font-medium leading-none',
          highlight ? highlightColors[highlight] : 'text-text',
        )}
      >
        {value}
      </p>
      {unit && (
        <p className="font-mono text-[10px] text-text-dim mt-1">{unit}</p>
      )}
    </div>
  )
}
