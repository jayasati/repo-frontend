import { cn }                  from '@/lib/utils/cn'
import type { DetectionResult } from '@/types/analysis.types'

interface DetectionChipsProps {
  detection: DetectionResult
}

interface Chip {
  label:     string
  value:     string
  highlight: boolean
}

export function DetectionChips({ detection }: DetectionChipsProps) {
  const lang       = detection.languages[0]
  const confidence = lang ? `${Math.round(lang.confidence * 100)}%` : '—'

  const chips: Chip[] = [
    { label: 'language',   value: lang?.name          ?? 'unknown', highlight: false },
    { label: 'framework',  value: detection.framework ?? 'none',    highlight: !!detection.framework },
    { label: 'orm',        value: detection.orm       ?? 'none',    highlight: !!detection.orm },
    { label: 'depth',      value: detection.analysisDepth,          highlight: false },
    { label: 'confidence', value: confidence,                        highlight: false },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(({ label, value, highlight }) => (
        <div
          key={label}
          className="bg-bg-surface border border-border rounded-lg px-3 py-2 flex flex-col gap-0.5"
        >
          <span className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em]">
            {label}
          </span>
          <span
            className={cn(
              'font-mono text-[13px] font-medium',
              highlight ? 'text-accent' : 'text-text',
            )}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}
