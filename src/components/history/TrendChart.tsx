'use client'

import { useEffect, useState } from 'react'
import { cn }                  from '@/lib/utils/cn'
import { Spinner }             from '@/components/ui/spinner'
import { EmptyState }          from '@/components/ui/empty-state'
import type { TrendReport, TrendPoint } from '@/types/history.types'

interface TrendChartProps {
  repoUrl: string
}

const trendColor = {
  improving: 'text-accent',
  degrading:  'text-ra-red',
  stable:     'text-text-muted',
} as const

const trendLabel = {
  improving: '↑ Improving',
  degrading:  '↓ Degrading',
  stable:     '→ Stable',
} as const

/** Map TrendPoint scores to SVG polyline coordinates inside a 300×60 viewport */
function buildPolyline(points: TrendPoint[], width = 300, height = 60, padding = 6): string {
  if (points.length < 2) return ''
  const scores = points.map((p) => p.overallScore)
  const min    = Math.min(...scores)
  const max    = Math.max(...scores)
  const range  = max - min || 1
  const xStep  = (width - padding * 2) / (points.length - 1)

  return points.map((p, i) => {
    const x = padding + i * xStep
    const y = padding + (1 - (p.overallScore - min) / range) * (height - padding * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

export function TrendChart({ repoUrl }: TrendChartProps) {
  const [report,    setReport]    = useState<TrendReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!repoUrl) return
    setIsLoading(true)
    setError(null)

    fetch(`/api/history/trend?repoUrl=${encodeURIComponent(repoUrl)}&limit=30`)
      .then((r) => r.ok ? r.json() : r.json().then((b: {message?: string}) => Promise.reject(b.message ?? 'Failed')))
      .then((d: TrendReport) => setReport(d))
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setIsLoading(false))
  }, [repoUrl])

  if (isLoading) return (
    <div className="flex items-center gap-2 py-6 text-text-muted">
      <Spinner size="sm" /><span className="font-mono text-[12px]">Loading trend…</span>
    </div>
  )

  if (error) return <div className="font-mono text-[12px] text-ra-red py-4">{error}</div>

  if (!report || report.points.length === 0) return (
    <EmptyState message="Not enough history to show a trend yet. Analyze this repo a few more times." />
  )

  const polyline = buildPolyline(report.points)

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className={cn('font-mono text-[13px] font-medium', trendColor[report.trend])}>
          {trendLabel[report.trend]}
        </span>
        <span className="font-mono text-[11px] text-text-dim">
          avg <span className="text-text">{report.avgScore.toFixed(1)}</span>
        </span>
        <span className="font-mono text-[11px] text-text-dim">
          best <span className="text-accent">{report.bestScore}</span>
        </span>
        <span className="font-mono text-[11px] text-text-dim">
          worst <span className="text-ra-red">{report.worstScore}</span>
        </span>
        <span className="font-mono text-[11px] text-text-dim">
          {report.points.length} analyses
        </span>
      </div>

      {/* SVG sparkline */}
      <div className="bg-bg-surface border border-border rounded-lg px-4 py-3">
        <svg
          viewBox="0 0 300 60"
          className="w-full h-16"
          preserveAspectRatio="none"
        >
          {/* Zero line at 60 (bottom) */}
          <line x1="0" y1="54" x2="300" y2="54" stroke="#27272A" strokeWidth="0.5" />

          {/* Area fill */}
          {polyline && (
            <polyline
              points={`6,54 ${polyline} 294,54`}
              fill={report.trend === 'improving' ? 'rgba(163,230,53,0.06)' : 'rgba(248,113,113,0.06)'}
              stroke="none"
            />
          )}

          {/* Line */}
          {polyline && (
            <polyline
              points={polyline}
              fill="none"
              stroke={report.trend === 'improving' ? '#A3E635' : report.trend === 'degrading' ? '#F87171' : '#71717A'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Dots — only show first, last, best, worst */}
          {report.points.map((p, i) => {
            const scores  = report.points.map((pp) => pp.overallScore)
            const isFirst = i === 0
            const isLast  = i === report.points.length - 1
            const isBest  = p.overallScore === Math.max(...scores)
            const isWorst = p.overallScore === Math.min(...scores)
            if (!isFirst && !isLast && !isBest && !isWorst) return null

            const coords = buildPolyline([p], 300, 60)
            const [cx, cy] = coords.split(',').map(Number)
            if (!cx || !cy) return null

            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="2.5"
                fill={isBest ? '#A3E635' : isWorst ? '#F87171' : '#71717A'}
              />
            )
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-1">
          <span className="font-mono text-[10px] text-text-dim">
            {new Date(report.points[0]?.analyzedAt ?? '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <span className="font-mono text-[10px] text-text-dim">
            {new Date(report.points.at(-1)?.analyzedAt ?? '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Score breakdown series */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[480px]" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '140px' }} />
            <col style={{ width: '60px' }} />
            <col style={{ width: '80px' }} />
            <col style={{ width: '80px' }} />
            <col style={{ width: '60px' }} />
            <col style={{ width: '60px' }} />
          </colgroup>
          <thead>
            <tr>
              {['Date', 'Score', 'Modularity', 'Coupling', 'Cycles', 'Smells'].map((h) => (
                <th key={h} className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] pb-2 pr-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...report.points].reverse().map((p) => (
              <tr key={p.id} className="hover:bg-bg-surface transition-colors">
                <td className="font-mono text-[11px] text-text-muted py-2 pr-3">
                  {new Date(p.analyzedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                </td>
                <td className={cn('font-mono text-[12px] font-medium py-2 pr-3', {
                  'text-accent':  p.overallScore >= 80,
                  'text-ra-amber': p.overallScore >= 60 && p.overallScore < 80,
                  'text-ra-red':  p.overallScore < 60,
                })}>
                  {p.overallScore}
                </td>
                <td className="font-mono text-[11px] text-text-muted py-2 pr-3">{p.modularityScore}</td>
                <td className="font-mono text-[11px] text-text-muted py-2 pr-3">{p.couplingScore}</td>
                <td className={cn('font-mono text-[11px] py-2 pr-3', p.cycleCount > 0 ? 'text-ra-red' : 'text-text-muted')}>
                  {p.cycleCount}
                </td>
                <td className={cn('font-mono text-[11px] py-2', p.smellCount > 0 ? 'text-ra-amber' : 'text-text-muted')}>
                  {p.smellCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
