'use client'

import { cn } from '@/lib/utils/cn'
import type { JobStatus } from '@/types/analysis.types'

interface LoadingStepsProps {
  status:   JobStatus | 'idle'
  message:  string
  progress: number
}

const STEPS: { status: JobStatus; label: string }[] = [
  { status: 'cloning',   label: 'Cloning repository…' },
  { status: 'scanning',  label: 'Building dependency graph…' },
  { status: 'analyzing', label: 'Running cycle + smell detection…' },
  { status: 'analyzing', label: 'Computing metrics & score…' },
  { status: 'analyzing', label: 'Generating PlantUML diagrams…' },
  { status: 'complete',  label: 'Assembling report…' },
]

const STATUS_ORDER: Record<string, number> = {
  queued:   0,
  cloning:  1,
  scanning: 2,
  analyzing:3,
  complete: 4,
  failed:   4,
}

export function LoadingSteps({ status, message, progress }: LoadingStepsProps) {
  const currentOrder = STATUS_ORDER[status] ?? 0

  return (
    <div className="w-full max-w-md mx-auto py-12">
      {/* Progress bar */}
      <div className="h-0.5 bg-border rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Live message */}
      <p className="font-mono text-[12px] text-text-muted mb-6 text-center min-h-[18px]">
        {message}
      </p>

      {/* Steps list */}
      <div className="flex flex-col gap-2.5">
        {STEPS.map((step, i) => {
          const stepOrder = STATUS_ORDER[step.status] ?? 0
          const isDone    = stepOrder < currentOrder
          const isActive  = stepOrder === currentOrder && status !== 'complete'

          return (
            <div key={i} className={cn('flex items-center gap-3 font-mono text-[12px]', {
              'text-accent':    isDone,
              'text-text':      isActive,
              'text-text-dim':  !isDone && !isActive,
            })}>
              <span className="w-4 text-center flex-shrink-0">
                {isDone   ? '✓'
                : isActive ? <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                : '○'
                }
              </span>
              {step.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
