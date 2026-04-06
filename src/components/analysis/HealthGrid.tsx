import type { ArchitectureHealth } from '@/types/analysis.types'

interface HealthGridProps {
  health: ArchitectureHealth
}

export function HealthGrid({ health }: HealthGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Strengths */}
      <div>
        <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-2">
          Strengths
        </p>
        <div className="flex flex-col gap-1.5">
          {health.strengths.length === 0 ? (
            <div className="text-[13px] text-text-dim px-2 py-1.5">None identified</div>
          ) : (
            health.strengths.map((s) => (
              <div
                key={s}
                className="flex items-start gap-2 bg-bg-surface border border-border rounded-md px-2.5 py-2 text-[13px] text-text"
              >
                <span className="text-accent flex-shrink-0 mt-px" aria-hidden>✓</span>
                {s}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Weaknesses */}
      <div>
        <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-2">
          Weaknesses
        </p>
        <div className="flex flex-col gap-1.5">
          {health.weaknesses.length === 0 ? (
            <div className="text-[13px] text-text-dim px-2 py-1.5">None identified</div>
          ) : (
            health.weaknesses.map((w) => (
              <div
                key={w}
                className="flex items-start gap-2 bg-bg-surface border border-border rounded-md px-2.5 py-2 text-[13px] text-text"
              >
                <span className="text-ra-red flex-shrink-0 mt-px" aria-hidden>✕</span>
                {w}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
