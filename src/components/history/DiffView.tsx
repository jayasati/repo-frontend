'use client'

import { useEffect, useState } from 'react'
import { Spinner }             from '@/components/ui/spinner'
import { cn }                  from '@/lib/utils/cn'
import type { AnalysisDiff, ModuleChange, HotspotChange, CycleChange } from '@/types/history.types'

interface DiffViewProps {
  fromId: string
  toId:   string
}

function DeltaCell({ value }: { value: number }) {
  const isPos = value > 0
  const isNeg = value < 0
  return (
    <span className={cn('font-mono text-[13px] font-medium', {
      'text-accent':  isPos,
      'text-ra-red':  isNeg,
      'text-text-dim': value === 0,
    })}>
      {isPos ? `+${value}` : value}
    </span>
  )
}

const statusColor = {
  improved: 'text-accent',
  degraded: 'text-ra-red',
  new:      'text-ra-red',
  removed:  'text-accent',
  appeared: 'text-ra-red',
  resolved: 'text-accent',
  worsened: 'text-ra-red',
  formed:   'text-ra-red',
  broken:   'text-accent',
} as const

const statusIcon = {
  improved: '↑',
  degraded: '↓',
  new:      '+',
  removed:  '−',
  appeared: '!',
  resolved: '✓',
  worsened: '↓',
  formed:   '⟳',
  broken:   '✓',
} as const

export function DiffView({ fromId, toId }: DiffViewProps) {
  const [diff,      setDiff]      = useState<AnalysisDiff | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setDiff(null)
    setError(null)

    fetch(`/api/history/diff?from=${fromId}&to=${toId}`)
      .then((r) => r.ok ? r.json() : r.json().then((b: {message?: string}) => Promise.reject(b.message ?? 'Failed')))
      .then((d: AnalysisDiff) => setDiff(d))
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setIsLoading(false))
  }, [fromId, toId])

  if (isLoading) return (
    <div className="flex items-center gap-2 py-6 text-text-muted">
      <Spinner size="sm" /><span className="font-mono text-[12px]">Loading diff…</span>
    </div>
  )

  if (error) return (
    <div className="font-mono text-[12px] text-ra-red py-4">{error}</div>
  )

  if (!diff) return null

  const deltaRows: { label: string; value: number; invertColor?: boolean }[] = [
    { label: 'Overall score',    value: diff.delta.overallScore    },
    { label: 'Modularity',       value: diff.delta.modularityScore },
    { label: 'Coupling',         value: diff.delta.couplingScore   },
    { label: 'Smells score',     value: diff.delta.smellsScore     },
    { label: 'Cycle count',      value: -diff.delta.cycleCount,  invertColor: true },
    { label: 'Smell count',      value: -diff.delta.smellCount,  invertColor: true },
    { label: 'Module count',     value: diff.delta.moduleCount     },
  ]

  const hasModuleChanges  = (diff.moduleChanges ?? []).length > 0
  const hasHotspotChanges = (diff.hotspotChanges ?? []).length > 0
  const hasCycleChanges   = (diff.cycleChanges ?? []).length > 0

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary header */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-[12px] text-text-dim">
          {new Date(diff.from.analyzedAt).toLocaleDateString()}
        </span>
        <span className="font-mono text-[11px] text-text-dim">→</span>
        <span className="font-mono text-[12px] text-text-dim">
          {new Date(diff.to.analyzedAt).toLocaleDateString()}
        </span>
        <span className={cn(
          'ml-2 px-2 py-0.5 rounded font-mono text-[11px] border',
          diff.regression
            ? 'bg-ra-red-dim text-ra-red border-ra-red/30'
            : 'bg-accent/10 text-accent border-accent/30',
        )}>
          {diff.regression ? 'regression' : 'improvement'}
        </span>
      </div>

      {/* Delta grid */}
      <div className="grid grid-cols-2 gap-2">
        {deltaRows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-3 py-2 bg-bg-surface rounded-lg border border-border">
            <span className="font-mono text-[11px] text-text-dim">{label}</span>
            <DeltaCell value={value} />
          </div>
        ))}
      </div>

      {/* Fixed / New smells */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-2">
            Fixed smells
          </p>
          {diff.fixedSmells.length === 0
            ? <p className="font-mono text-[11px] text-text-dim">None</p>
            : diff.fixedSmells.map((s) => (
              <div key={s} className="px-2 py-1.5 mb-1 rounded bg-accent/8 border border-accent/20 font-mono text-[11px] text-accent">
                ✓ {s}
              </div>
            ))
          }
        </div>

        <div>
          <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-2">
            New smells
          </p>
          {diff.newSmells.length === 0
            ? <p className="font-mono text-[11px] text-text-dim">None introduced</p>
            : diff.newSmells.map((s) => (
              <div key={s} className="px-2 py-1.5 mb-1 rounded bg-ra-red-dim border border-ra-red/20 font-mono text-[11px] text-ra-red">
                ✕ {s}
              </div>
            ))
          }
        </div>
      </div>

      {/* ── Module-Level Changes ───────────────────────────────────────── */}
      {hasModuleChanges && (
        <div>
          <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-2">
            Module changes
          </p>
          <div className="space-y-1">
            {diff.moduleChanges.map((mc) => (
              <ModuleChangeRow key={mc.module} change={mc} />
            ))}
          </div>
        </div>
      )}

      {/* ── Hotspot Changes ────────────────────────────────────────────── */}
      {hasHotspotChanges && (
        <div>
          <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-2">
            Hotspot changes
          </p>
          <div className="space-y-1">
            {diff.hotspotChanges.map((hc) => (
              <div key={hc.module} className="flex items-center justify-between px-3 py-2 bg-bg-surface rounded-lg border border-border">
                <span className="font-mono text-[11px] text-text">{hc.module}</span>
                <div className="flex items-center gap-2">
                  {hc.fanOutBefore != null && hc.fanOutAfter != null && (
                    <span className="font-mono text-[10px] text-text-dim">
                      fan-out {hc.fanOutBefore} → {hc.fanOutAfter}
                    </span>
                  )}
                  <span className={cn('font-mono text-[11px] font-medium', statusColor[hc.status])}>
                    {statusIcon[hc.status]} {hc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Cycle Changes ──────────────────────────────────────────────── */}
      {hasCycleChanges && (
        <div>
          <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-2">
            Cycle changes
          </p>
          <div className="space-y-1">
            {diff.cycleChanges.map((cc, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 bg-bg-surface rounded-lg border border-border">
                <span className="font-mono text-[11px] text-text truncate max-w-[70%]">
                  {cc.nodes.join(' → ')}
                </span>
                <span className={cn('font-mono text-[11px] font-medium', statusColor[cc.status])}>
                  {statusIcon[cc.status]} {cc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/** Expandable row showing per-module smell changes */
function ModuleChangeRow({ change }: { change: ModuleChange }) {
  const [expanded, setExpanded] = useState(false)
  const mc = change

  return (
    <div className="bg-bg-surface rounded-lg border border-border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-bg-surface/80 transition-colors"
      >
        <span className="font-mono text-[11px] text-text">{mc.module}</span>
        <div className="flex items-center gap-2">
          <span className={cn('font-mono text-[11px] font-medium', statusColor[mc.status])}>
            {statusIcon[mc.status]} {mc.status}
          </span>
          <span className="font-mono text-[10px] text-text-dim">
            {expanded ? '▾' : '▸'}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-2 grid grid-cols-2 gap-2">
          <div>
            {mc.removedSmells.length > 0 && mc.removedSmells.map((s) => (
              <div key={s} className="font-mono text-[10px] text-accent py-0.5">✓ fixed: {s}</div>
            ))}
            {mc.removedSmells.length === 0 && (
              <div className="font-mono text-[10px] text-text-dim py-0.5">No smells fixed</div>
            )}
          </div>
          <div>
            {mc.addedSmells.length > 0 && mc.addedSmells.map((s) => (
              <div key={s} className="font-mono text-[10px] text-ra-red py-0.5">✕ new: {s}</div>
            ))}
            {mc.addedSmells.length === 0 && (
              <div className="font-mono text-[10px] text-text-dim py-0.5">No new smells</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
