'use client'

import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { cn }          from '@/lib/utils/cn'
import { Spinner }     from '@/components/ui/spinner'
import { EmptyState }  from '@/components/ui/empty-state'
import type { TrendReport, TrendPoint, TrendDirection } from '@/types/history.types'

interface TrendChartProps {
  repoUrl: string
  limit: number
  /** Optional target score line */
  targetScore?: number
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

const trendArrow = {
  improving: '↑',
  degrading: '↓',
  stable:    '→',
} as const

/** Metric line config */
const METRICS = [
  { key: 'overallScore',    label: 'Overall',    color: '#A3E635', defaultOn: true },
  { key: 'modularityScore', label: 'Modularity', color: '#60A5FA', defaultOn: false },
  { key: 'couplingScore',   label: 'Coupling',   color: '#C084FC', defaultOn: false },
  { key: 'smellsScore',     label: 'Smells',     color: '#FB923C', defaultOn: false },
] as const

type MetricKey = typeof METRICS[number]['key']

function TrendBadge({ direction, label }: { direction: TrendDirection; label: string }) {
  return (
    <span className={cn('font-mono text-[10px]', trendColor[direction])}>
      {trendArrow[direction]} {label}
    </span>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDateFull(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function TrendChart({ repoUrl, limit, targetScore }: TrendChartProps) {
  const [report,    setReport]    = useState<TrendReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(
    new Set(METRICS.filter((m) => m.defaultOn).map((m) => m.key)),
  )

  useEffect(() => {
    if (!repoUrl) return
    setIsLoading(true)
    setError(null)

    fetch(`/api/history/trend?repoUrl=${encodeURIComponent(repoUrl)}&limit=${limit}&_ts=${Date.now()}`)
      .then((r) => r.ok ? r.json() : r.json().then((b: {message?: string}) => Promise.reject(b.message ?? 'Failed')))
      .then((d: TrendReport) => setReport(d))
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setIsLoading(false))
  }, [repoUrl, limit, refreshTick])

  useEffect(() => {
    if (!repoUrl) return
    const onFocus = () => setRefreshTick((n) => n + 1)
    const timer = window.setInterval(() => setRefreshTick((n) => n + 1), 8000)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
      window.clearInterval(timer)
    }
  }, [repoUrl])

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        // Don't allow deselecting all
        if (next.size > 1) next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  if (isLoading) return (
    <div className="flex items-center gap-2 py-6 text-text-muted">
      <Spinner size="sm" /><span className="font-mono text-[12px]">Loading trend…</span>
    </div>
  )

  if (error) return <div className="font-mono text-[12px] text-ra-red py-4">{error}</div>

  if (!report || report.points.length < 2) return (
    <EmptyState message="Not enough history to show a trend yet. Analyze this repo a few more times." />
  )

  const firstScore = report.points[0]?.overallScore ?? 0
  const lastScore = report.points.at(-1)?.overallScore ?? 0
  const deltaScore = lastScore - firstScore
  const mt = report.metricTrends

  // Prepare chart data with formatted dates
  const chartData = report.points.map((p) => ({
    ...p,
    date: formatDate(p.analyzedAt),
    dateFull: formatDateFull(p.analyzedAt),
  }))

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
        <span className="font-mono text-[11px] text-text-dim">
          delta <span className={cn(deltaScore >= 0 ? 'text-accent' : 'text-ra-red')}>{deltaScore >= 0 ? '+' : ''}{deltaScore}</span>
        </span>
      </div>

      {/* Per-metric trend badges */}
      {mt && (
        <div className="flex items-center gap-4 flex-wrap border border-border rounded-lg px-3 py-2 bg-bg-surface">
          <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider mr-1">Metric Trends</span>
          <TrendBadge direction={mt.modularity} label="Modularity" />
          <TrendBadge direction={mt.coupling}   label="Coupling" />
          <TrendBadge direction={mt.smells}     label="Smells Score" />
          <TrendBadge direction={mt.cycles}     label="Cycles" />
          <TrendBadge direction={mt.smellCount} label="Smell Count" />
        </div>
      )}

      {/* Metric toggle buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider">Show:</span>
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => toggleMetric(m.key)}
            className={cn(
              'px-2 py-1 rounded font-mono text-[11px] border transition-colors',
              activeMetrics.has(m.key)
                ? 'border-current opacity-100'
                : 'border-border text-text-dim opacity-50 hover:opacity-75',
            )}
            style={activeMetrics.has(m.key) ? { color: m.color, borderColor: m.color } : undefined}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Interactive Recharts line chart */}
      <div className="bg-bg-surface border border-border rounded-lg px-4 py-3">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#71717A', fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#27272A' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#71717A', fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#27272A' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181B',
                border: '1px solid #3F3F46',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '11px',
              }}
              labelFormatter={(_, payload) => {
                const point = payload?.[0]?.payload
                return point?.dateFull ?? ''
              }}
            />

            {/* Target score reference line */}
            {targetScore != null && (
              <ReferenceLine
                y={targetScore}
                stroke="#A3E635"
                strokeDasharray="6 3"
                strokeOpacity={0.4}
                label={{
                  value: `Target: ${targetScore}`,
                  position: 'right',
                  fill: '#A3E635',
                  fontSize: 10,
                  fontFamily: 'monospace',
                }}
              />
            )}

            {/* Metric lines */}
            {METRICS.map((m) =>
              activeMetrics.has(m.key) ? (
                <Line
                  key={m.key}
                  type="monotone"
                  dataKey={m.key}
                  name={m.label}
                  stroke={m.color}
                  strokeWidth={m.key === 'overallScore' ? 2 : 1.5}
                  dot={{ r: 3, fill: m.color }}
                  activeDot={{ r: 5 }}
                />
              ) : null,
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Score breakdown table with per-column trend arrows */}
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
              <th className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] pb-2 pr-3">Date</th>
              <th className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] pb-2 pr-3">
                Score {mt && <span className={trendColor[mt.overall]}>{trendArrow[mt.overall]}</span>}
              </th>
              <th className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] pb-2 pr-3">
                Modularity {mt && <span className={trendColor[mt.modularity]}>{trendArrow[mt.modularity]}</span>}
              </th>
              <th className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] pb-2 pr-3">
                Coupling {mt && <span className={trendColor[mt.coupling]}>{trendArrow[mt.coupling]}</span>}
              </th>
              <th className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] pb-2 pr-3">
                Cycles {mt && <span className={trendColor[mt.cycles]}>{trendArrow[mt.cycles]}</span>}
              </th>
              <th className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] pb-2">
                Smells {mt && <span className={trendColor[mt.smellCount]}>{trendArrow[mt.smellCount]}</span>}
              </th>
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
