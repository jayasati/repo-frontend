'use client'

import { useState }         from 'react'
import { Download, MessageSquare, Network } from 'lucide-react'
import { ShareButton }            from '@/components/analysis/ShareButton'
import { useRouter }          from 'next/navigation'
import { toast }              from 'sonner'

import { ScoreRing }         from '@/components/analysis/ScoreRing'
import { MetricCard }        from '@/components/analysis/MetricCard'
import { SmellItem }         from '@/components/analysis/SmellItem'
import { CycleItem }         from '@/components/analysis/CycleItem'
import { HotspotItem }       from '@/components/analysis/HotspotItem'
import { DetectionChips }    from '@/components/analysis/DetectionChips'
import { HealthGrid }        from '@/components/analysis/HealthGrid'
import { DiagramBlock }      from '@/components/analysis/DiagramBlock'
import { EmptyState }        from '@/components/ui/empty-state'
import { SectionHeader }     from '@/components/ui/section-header'
import { Badge }             from '@/components/ui/badge'
import { Button }            from '@/components/ui/button'

import type { PipelineResult } from '@/types/analysis.types'
import type { ReportFormat }   from '@/lib/api/analyze.api'

interface AnalyzeResultsViewProps {
  result: PipelineResult
  jobId:  string
}

function scoreHighlight(n: number): 'green' | 'amber' | 'red' {
  if (n >= 80) return 'green'
  if (n >= 60) return 'amber'
  return 'red'
}

/**
 * AnalyzeResultsView — renders the full PipelineResult.
 * Designed as a pure presentational component (receives data as props).
 * The parent /analyze/[jobId] page handles fetching.
 */
export function AnalyzeResultsView({ result, jobId }: AnalyzeResultsViewProps) {
  const [downloading, setDownloading] = useState(false)
  const router = useRouter()

  const handleDownload = async (format: ReportFormat) => {
    setDownloading(true)
    try {
      const res = await fetch(`/api/analyze/${jobId}/report?format=${format}`)
      if (!res.ok) { toast.error('Download failed'); return }

      const blob        = await res.blob()
      const ext         = format === 'html' ? 'html' : format === 'markdown' ? 'md' : 'json'
      const url         = URL.createObjectURL(blob)
      const a           = document.createElement('a')
      a.href            = url
      a.download        = `report-${jobId.slice(0, 8)}.${ext}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Download failed')
    } finally {
      setDownloading(false)
    }
  }

  const { score, detection, metrics, health, smells, cycles, hotspots, diagrams } = result
  const density = `${(metrics.dependencyDensity * 100).toFixed(1)}%`

  return (
    <div className="space-y-8 pb-16 animate-fade-in">

      {/* ── Score hero ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-6 bg-bg-surface border border-border rounded-xl p-5">
        <ScoreRing score={score.overall} size={100} />

        <div className="flex-1 min-w-0">
          <p className="text-[18px] font-medium text-text mb-1 truncate">
            {result.projectName}
          </p>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {detection.languages[0] && (
              <Badge variant="muted">{detection.languages[0].name}</Badge>
            )}
            {detection.framework && (
              <Badge variant="green">{detection.framework}</Badge>
            )}
            {detection.orm && (
              <Badge variant="blue">{detection.orm}</Badge>
            )}
          </div>
          {/* Breakdown pills */}
          <div className="flex gap-2 flex-wrap">
            {([
              { label: 'modularity', val: score.breakdown.modularity },
              { label: 'coupling',   val: score.breakdown.coupling   },
              { label: 'smells',     val: score.breakdown.smells     },
            ] as const).map(({ label, val }) => (
              <span
                key={label}
                className="px-2.5 py-1 rounded-full border border-border font-mono text-[11px] text-text-muted"
              >
                {label}{' '}
                <span
                  className={
                    val >= 80 ? 'text-accent'
                    : val >= 60 ? 'text-ra-amber'
                    : 'text-ra-red'
                  }
                >
                  {val}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <ShareButton jobId={jobId} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/chat?jobId=${jobId}`)}
            className="font-mono text-[11px] gap-1.5 border-accent/40 text-accent hover:bg-accent/10"
          >
            <MessageSquare className="h-3 w-3" />
            Chat
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/graph/${jobId}`)}
            className="font-mono text-[11px] gap-1.5"
          >
            <Network className="h-3 w-3" />
            Graph
          </Button>
          {(['markdown', 'html', 'json'] as const).map((fmt) => (
            <Button
              key={fmt}
              variant="ghost"
              size="sm"
              loading={downloading}
              onClick={() => void handleDownload(fmt)}
              className="font-mono text-[11px] gap-1.5"
            >
              <Download className="h-3 w-3" />
              .{fmt === 'markdown' ? 'md' : fmt}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Detection chips ──────────────────────────────────────────────── */}
      <div>
        <SectionHeader title="Detection" />
        <DetectionChips detection={detection} />
      </div>

      {/* ── Health report ────────────────────────────────────────────────── */}
      <div>
        <SectionHeader title="Health report" />
        <HealthGrid health={health} />
      </div>

      {/* ── Metrics grid ─────────────────────────────────────────────────── */}
      <div>
        <SectionHeader title="Architecture metrics" />
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          <MetricCard label="Modules"     value={metrics.moduleCount}       unit="packages" />
          <MetricCard label="Deps"        value={metrics.dependencyCount}   unit="edges" />
          <MetricCard label="Cycles"      value={metrics.cycleCount}        unit="detected"
            highlight={metrics.cycleCount > 0 ? 'red' : 'green'} />
          <MetricCard label="Avg fan-in"  value={metrics.averageFanIn}      unit="per module" />
          <MetricCard label="Avg fan-out" value={metrics.averageFanOut}     unit="per module" />
          <MetricCard label="Max fan-out" value={metrics.maxFanOut}         unit="hotspot"
            highlight={scoreHighlight(100 - metrics.maxFanOut * 5)} />
          <MetricCard label="Density"     value={density}                   unit="coupling" />
        </div>
      </div>

      {/* ── Smells ───────────────────────────────────────────────────────── */}
      <div>
        <SectionHeader title="Architecture smells" count={smells.length} />
        {smells.length === 0
          ? <EmptyState message="No architecture smells detected" variant="success" />
          : <div className="flex flex-col gap-2">{smells.map((s, i) => <SmellItem key={i} smell={s} />)}</div>
        }
      </div>

      {/* ── Cycles ───────────────────────────────────────────────────────── */}
      <div>
        <SectionHeader title="Circular dependencies" count={cycles.length} />
        {cycles.length === 0
          ? <EmptyState message="No circular dependencies detected" variant="success" />
          : <div className="flex flex-col gap-2">{cycles.map((c, i) => <CycleItem key={i} cycle={c} />)}</div>
        }
      </div>

      {/* ── Hotspots ─────────────────────────────────────────────────────── */}
      <div>
        <SectionHeader title="Hotspots" count={hotspots.length} />
        {hotspots.length === 0
          ? <EmptyState message="No hotspots detected" variant="success" />
          : <div className="flex flex-col gap-2">{hotspots.map((h, i) => <HotspotItem key={i} hotspot={h} />)}</div>
        }
      </div>

      {/* ── Diagrams ─────────────────────────────────────────────────────── */}
      {diagrams && Object.values(diagrams).some(Boolean) && (
        <div>
          <SectionHeader title="PlantUML diagrams" />
          <div className="flex flex-col gap-2">
            {diagrams.componentDiagram && (
              <DiagramBlock title="Component diagram" content={diagrams.componentDiagram} />
            )}
            {diagrams.classDiagram && (
              <DiagramBlock title="Class diagram" content={diagrams.classDiagram} />
            )}
            {diagrams.sequenceDiagram && (
              <DiagramBlock title="Sequence diagram" content={diagrams.sequenceDiagram} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
