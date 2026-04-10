'use client'

import { useEffect, useState } from 'react'
import { cn }          from '@/lib/utils/cn'
import { Spinner }     from '@/components/ui/spinner'
import type { ModuleTrendReport, ModuleTrend, TrendDirection } from '@/types/history.types'

interface ModuleTrendsProps {
  repoUrl: string
  limit: number
}

const trendColor = {
  improving: 'text-accent',
  degrading:  'text-ra-red',
  stable:     'text-text-muted',
} as const

const trendArrow = {
  improving: '↑',
  degrading: '↓',
  stable:    '→',
} as const

/** Tiny inline SVG sparkline for a number[] series */
function MiniSparkline({ data, trend }: { data: number[]; trend: TrendDirection }) {
  if (data.length < 2) return null
  const max = Math.max(...data, 1)
  const w = 60
  const h = 20
  const padding = 2

  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (w - padding * 2)
      const y = padding + (1 - v / max) * (h - padding * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const color =
    trend === 'improving' ? '#A3E635' :
    trend === 'degrading' ? '#F87171' : '#71717A'

  return (
    <svg width={w} height={h} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ModuleTrends({ repoUrl, limit }: ModuleTrendsProps) {
  const [report,    setReport]    = useState<ModuleTrendReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!repoUrl) return
    setIsLoading(true)
    setError(null)

    fetch(`/api/history/trend/modules?repoUrl=${encodeURIComponent(repoUrl)}&limit=${limit}&_ts=${Date.now()}`)
      .then((r) => r.ok ? r.json() : r.json().then((b: {message?: string}) => Promise.reject(b.message ?? 'Failed')))
      .then((d: ModuleTrendReport) => setReport(d))
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setIsLoading(false))
  }, [repoUrl, limit])

  if (isLoading) return (
    <div className="flex items-center gap-2 py-4 text-text-muted">
      <Spinner size="sm" /><span className="font-mono text-[12px]">Loading module trends…</span>
    </div>
  )

  if (error) return <div className="font-mono text-[12px] text-ra-red py-2">{error}</div>

  if (!report || report.modules.length === 0) return null

  return (
    <div>
      <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-3">
        Module Health Trends
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[400px]" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '35%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <thead>
            <tr>
              {['Module', 'Smells', 'Delta', 'Trend', 'History'].map((h) => (
                <th key={h} className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] pb-2 pr-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {report.modules.map((m) => (
              <tr key={m.module} className="hover:bg-bg-surface transition-colors">
                <td className="font-mono text-[11px] text-text py-2 pr-2 truncate" title={m.module}>
                  {m.module}
                </td>
                <td className={cn('font-mono text-[12px] font-medium py-2 pr-2', {
                  'text-ra-red':  m.currentSmellCount > 0,
                  'text-text-dim': m.currentSmellCount === 0,
                })}>
                  {m.currentSmellCount}
                </td>
                <td className={cn('font-mono text-[11px] py-2 pr-2', {
                  'text-ra-red':  m.delta > 0,
                  'text-accent':  m.delta < 0,
                  'text-text-dim': m.delta === 0,
                })}>
                  {m.delta > 0 ? `+${m.delta}` : m.delta}
                </td>
                <td className={cn('font-mono text-[11px] py-2 pr-2', trendColor[m.trend])}>
                  {trendArrow[m.trend]} {m.trend}
                </td>
                <td className="py-2">
                  <MiniSparkline data={m.history} trend={m.trend} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
