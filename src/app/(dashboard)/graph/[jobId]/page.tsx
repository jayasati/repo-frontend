'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams }    from 'next/navigation'
import { Network, Search, ArrowRight, Zap, ChevronDown } from 'lucide-react'
import { cn }           from '@/lib/utils/cn'
import { Spinner }      from '@/components/ui/spinner'
import { EmptyState }   from '@/components/ui/empty-state'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ModuleInfo {
  id: string
  type: string
  filePath?: string
  fanIn: number
  fanOut: number
}

interface GraphSummary {
  nodeCount: number
  edgeCount: number
  nodesByType: Record<string, number>
  edgesByType: Record<string, number>
  topFanOut: ModuleInfo[]
  topFanIn: ModuleInfo[]
}

interface DependencyResult {
  module: string
  direction: 'outgoing' | 'incoming'
  dependencies: Array<{ id: string; type: string; edgeType: string }>
}

interface PathResult {
  from: string
  to: string
  path: string[] | null
  length: number
}

interface ImpactResult {
  module: string
  depth: number
  affected: ModuleInfo[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Strips temp directory prefixes from node IDs.
 * "/app/.tmp/repo-69e6cb65.../src/core/core.module.ts" → "src/core/core.module.ts"
 * Also handles Windows backslash paths.
 */
function cleanPath(id: string): string {
  // Strip everything up to and including the repo-UUID directory
  const cleaned = id.replace(/^.*?\.tmp[\\/]repo-[a-f0-9-]+[\\/]/, '')
  // If still has a long absolute path, try to extract from src/ onward
  const srcIdx = cleaned.indexOf('src/')
  if (srcIdx > 0) return cleaned.slice(srcIdx)
  const srcIdx2 = cleaned.indexOf('src\\')
  if (srcIdx2 > 0) return cleaned.slice(srcIdx2).replace(/\\/g, '/')
  return cleaned
}

function typeColor(type: string) {
  switch (type) {
    case 'controller': return 'text-blue-400'
    case 'service':    return 'text-purple-400'
    case 'module':     return 'text-green-400'
    case 'file':       return 'text-text-dim'
    default:           return 'text-text-muted'
  }
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="px-3 py-2 bg-bg-surface border border-border rounded-lg">
      <p className="font-mono text-[10px] text-text-dim uppercase tracking-wider">{label}</p>
      <p className="font-mono text-[16px] font-medium text-text">{value}</p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GraphExplorerPage() {
  const params = useParams<{ jobId: string }>()
  const jobId = params.jobId

  const [summary, setSummary] = useState<GraphSummary | null>(null)
  const [modules, setModules] = useState<ModuleInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  // Module detail panel
  const [selected, setSelected] = useState<string | null>(null)
  const [deps,     setDeps]     = useState<DependencyResult | null>(null)
  const [revDeps,  setRevDeps]  = useState<DependencyResult | null>(null)
  const [impact,   setImpact]   = useState<ImpactResult | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Path finder
  const [pathFrom,   setPathFrom]   = useState('')
  const [pathTo,     setPathTo]     = useState('')
  const [pathResult, setPathResult] = useState<PathResult | null>(null)
  const [pathLoading, setPathLoading] = useState(false)

  // Sort
  const [sortBy, setSortBy] = useState<'fanOut' | 'fanIn' | 'id'>('fanOut')

  // ── Load summary + modules ────────────────────────────────────────────────

  useEffect(() => {
    if (!jobId) return
    setLoading(true)
    Promise.all([
      fetch(`/api/graph/${jobId}`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/graph/${jobId}/modules?sort=${sortBy}&limit=100`).then((r) => r.ok ? r.json() : []),
    ])
      .then(([sum, mods]) => {
        setSummary(sum)
        setModules(mods ?? [])
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [jobId, sortBy])

  // ── Select module → load details ──────────────────────────────────────────

  const selectModule = useCallback((id: string) => {
    setSelected(id)
    setDeps(null)
    setRevDeps(null)
    setImpact(null)
    setDetailLoading(true)

    Promise.all([
      fetch(`/api/graph/${jobId}/dependencies?module=${encodeURIComponent(id)}`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/graph/${jobId}/dependents?module=${encodeURIComponent(id)}`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/graph/${jobId}/impact?module=${encodeURIComponent(id)}&depth=3`).then((r) => r.ok ? r.json() : null),
    ])
      .then(([d, rd, imp]) => {
        setDeps(d)
        setRevDeps(rd)
        setImpact(imp)
      })
      .finally(() => setDetailLoading(false))
  }, [jobId])

  // ── Path finder ───────────────────────────────────────────────────────────

  const findPath = useCallback(() => {
    if (!pathFrom || !pathTo) return
    setPathLoading(true)
    setPathResult(null)
    fetch(`/api/graph/${jobId}/path?from=${encodeURIComponent(pathFrom)}&to=${encodeURIComponent(pathTo)}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setPathResult(d))
      .finally(() => setPathLoading(false))
  }, [jobId, pathFrom, pathTo])

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="flex items-center gap-2 py-16 justify-center text-text-muted">
      <Spinner size="sm" /><span className="font-mono text-[12px]">Loading graph…</span>
    </div>
  )

  if (error) return <div className="p-6 font-mono text-[12px] text-ra-red">{error}</div>
  if (!summary) return <EmptyState message="Graph data not found. Analysis may have expired." />

  return (
    <div className="p-6 max-w-6xl animate-fade-in">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-accent tracking-[0.1em] uppercase mb-2">Graph Explorer</p>
        <h1 className="text-[22px] font-medium text-text mb-1">Dependency Graph</h1>
        <p className="text-[14px] text-text-muted">
          Explore modules, dependencies, and impact radius.
        </p>
      </div>

      {/* ── Summary stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Nodes" value={summary.nodeCount} />
        <StatCard label="Edges" value={summary.edgeCount} />
        <StatCard label="Max Fan-Out" value={summary.topFanOut[0]?.fanOut ?? 0} />
        <StatCard label="Max Fan-In" value={summary.topFanIn[0]?.fanIn ?? 0} />
      </div>

      {/* ── Path finder ───────────────────────────────────────────────────── */}
      <div className="bg-bg-surface border border-border rounded-lg p-4 mb-6">
        <p className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-2">
          <Search className="h-3 w-3 inline mr-1" />Path Finder
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={pathFrom}
            onChange={(e) => setPathFrom(e.target.value)}
            placeholder="From module"
            className="flex-1 px-3 py-2 rounded border border-border bg-bg font-mono text-[12px] text-text outline-none focus:border-accent"
          />
          <ArrowRight className="h-4 w-4 text-text-dim flex-shrink-0" />
          <input
            type="text"
            value={pathTo}
            onChange={(e) => setPathTo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && findPath()}
            placeholder="To module"
            className="flex-1 px-3 py-2 rounded border border-border bg-bg font-mono text-[12px] text-text outline-none focus:border-accent"
          />
          <button
            onClick={findPath}
            disabled={pathLoading}
            className="px-4 py-2 bg-accent text-black rounded font-mono text-[12px] font-medium hover:bg-accent/90 disabled:opacity-50"
          >
            Find
          </button>
        </div>
        {pathResult && (
          <div className="mt-3">
            {pathResult.path ? (
              <div className="font-mono text-[12px] text-text">
                <span className="text-text-dim">Path ({pathResult.length} hops):</span>{' '}
                {pathResult.path.map((node, i) => (
                  <span key={i}>
                    <button
                      onClick={() => selectModule(node)}
                      className="text-accent hover:underline"
                    >
                      {cleanPath(node)}
                    </button>
                    {i < pathResult.path!.length - 1 && <span className="text-text-dim"> → </span>}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-mono text-[12px] text-text-dim">No path found between these modules.</p>
            )}
          </div>
        )}
      </div>

      {/* ── Main layout: module list + detail panel ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">

        {/* Module list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[10px] text-text-dim uppercase tracking-wider">
              Modules ({modules.length})
            </p>
            <div className="flex items-center gap-1">
              <span className="font-mono text-[10px] text-text-dim">Sort:</span>
              {(['fanOut', 'fanIn', 'id'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={cn(
                    'px-1.5 py-0.5 rounded font-mono text-[10px] border transition-colors',
                    sortBy === s
                      ? 'border-accent text-accent'
                      : 'border-border text-text-dim hover:text-text',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => selectModule(m.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors text-left',
                  selected === m.id
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-border-2 hover:bg-bg-surface',
                )}
              >
                <div className="min-w-0">
                  <p className="font-mono text-[12px] text-text truncate">{cleanPath(m.id)}</p>
                  <p className={cn('font-mono text-[10px]', typeColor(m.type))}>{m.type}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <span className="font-mono text-[10px] text-text-dim">
                    in:<span className="text-text ml-0.5">{m.fanIn}</span>
                  </span>
                  <span className="font-mono text-[10px] text-text-dim">
                    out:<span className="text-text ml-0.5">{m.fanOut}</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div>
          {!selected ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-border rounded-lg">
              <Network className="h-8 w-8 text-text-dim mb-3" />
              <p className="text-[14px] text-text-muted">Select a module to explore its dependencies</p>
            </div>
          ) : detailLoading ? (
            <div className="flex items-center gap-2 py-16 justify-center text-text-muted">
              <Spinner size="sm" /><span className="font-mono text-[12px]">Loading details…</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-bg-surface border border-border rounded-lg p-4">
                <h2 className="font-mono text-[14px] font-medium text-text mb-1">{cleanPath(selected)}</h2>
              </div>

              {/* Outgoing dependencies */}
              {deps && deps.dependencies.length > 0 && (
                <div className="bg-bg-surface border border-border rounded-lg p-4">
                  <p className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-2">
                    Outgoing Dependencies ({deps.dependencies.length})
                  </p>
                  <div className="space-y-1">
                    {deps.dependencies.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => selectModule(d.id)}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-bg transition-colors text-left"
                      >
                        <span className="font-mono text-[11px] text-accent truncate">{cleanPath(d.id)}</span>
                        <span className={cn('font-mono text-[10px]', typeColor(d.type))}>{d.type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Incoming dependents */}
              {revDeps && revDeps.dependencies.length > 0 && (
                <div className="bg-bg-surface border border-border rounded-lg p-4">
                  <p className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-2">
                    Incoming Dependents ({revDeps.dependencies.length})
                  </p>
                  <div className="space-y-1">
                    {revDeps.dependencies.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => selectModule(d.id)}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-bg transition-colors text-left"
                      >
                        <span className="font-mono text-[11px] text-accent truncate">{cleanPath(d.id)}</span>
                        <span className={cn('font-mono text-[10px]', typeColor(d.type))}>{d.type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact radius */}
              {impact && impact.affected.length > 0 && (
                <div className="bg-bg-surface border border-border rounded-lg p-4">
                  <p className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-2">
                    <Zap className="h-3 w-3 inline mr-1 text-ra-amber" />
                    Impact Radius — {impact.affected.length} modules affected if this changes
                  </p>
                  <div className="space-y-1">
                    {impact.affected.slice(0, 20).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => selectModule(m.id)}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-bg transition-colors text-left"
                      >
                        <span className="font-mono text-[11px] text-text truncate">{cleanPath(m.id)}</span>
                        <span className="font-mono text-[10px] text-text-dim">
                          in:{m.fanIn} out:{m.fanOut}
                        </span>
                      </button>
                    ))}
                    {impact.affected.length > 20 && (
                      <p className="font-mono text-[10px] text-text-dim pt-1">
                        +{impact.affected.length - 20} more
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
