/**
 * History types — mirror the NestJS history/trend response shapes.
 *
 * Sources:
 *   src/history/history.service.ts   → HistoryEntry
 *   src/history/diff.service.ts      → AnalysisDiff
 *   src/history/trend.service.ts     → TrendReport, TrendPoint
 */

// ── History entry (from GET /history) ─────────────────────────────────────────
// Mirrors the select() projection in HistoryService.getHistory()

export interface HistoryEntry {
  id:                string
  repoUrl:           string
  projectName:       string
  overallScore:      number
  modularityScore:   number
  couplingScore:     number
  smellsScore:       number
  cycleCount:        number
  smellCount:        number
  moduleCount:       number
  detectedFramework?: string
  detectedLanguage?:  string
  analyzedAt:        string   // ISO timestamp
}

/** Paginated history response */
export interface PaginatedHistory {
  items:      HistoryEntry[]
  nextCursor: string | null
  hasMore:    boolean
}

// ── Diff (from GET /history/diff?from=&to=) ───────────────────────────────────

export interface DiffDelta {
  overallScore:    number
  modularityScore: number
  couplingScore:   number
  smellsScore:     number
  cycleCount:      number
  smellCount:      number
  moduleCount:     number
}

export interface ModuleChange {
  module:        string
  status:        'improved' | 'degraded' | 'new' | 'removed'
  smellsBefore:  string[]
  smellsAfter:   string[]
  addedSmells:   string[]
  removedSmells: string[]
}

export interface HotspotChange {
  module:        string
  status:        'appeared' | 'resolved' | 'worsened' | 'improved'
  fanOutBefore?: number
  fanOutAfter?:  number
}

export interface CycleChange {
  nodes:  string[]
  status: 'formed' | 'broken'
}

export interface AnalysisDiff {
  from:            { id: string; analyzedAt: string; score: number }
  to:              { id: string; analyzedAt: string; score: number }
  delta:           DiffDelta
  regression:      boolean
  newSmells:       string[]
  fixedSmells:     string[]
  moduleChanges:   ModuleChange[]
  hotspotChanges:  HotspotChange[]
  cycleChanges:    CycleChange[]
}

// ── Trend (from GET /history/trend) ───────────────────────────────────────────

export interface TrendPoint {
  id:              string
  analyzedAt:      string
  overallScore:    number
  modularityScore: number
  couplingScore:   number
  smellsScore:     number
  cycleCount:      number
  smellCount:      number
}

export type TrendDirection = 'improving' | 'degrading' | 'stable'

/** Per-metric trend directions computed independently on the backend. */
export interface MetricTrends {
  overall:    TrendDirection
  modularity: TrendDirection
  coupling:   TrendDirection
  smells:     TrendDirection
  /** Inverted: fewer cycles = improving */
  cycles:     TrendDirection
  /** Inverted: fewer smells = improving */
  smellCount: TrendDirection
}

export interface TrendReport {
  repoUrl:      string
  points:       TrendPoint[]
  trend:        TrendDirection
  /** Per-metric trend directions */
  metricTrends: MetricTrends
  avgScore:     number
  bestScore:    number
  worstScore:   number
}

// ── Aggregated trend (from GET /history/trend/aggregated) ────────────────────

export type BucketSize = 'daily' | 'weekly' | 'monthly'

export interface AggregatedPoint {
  bucketStart:        string
  count:              number
  avgOverallScore:    number
  avgModularityScore: number
  avgCouplingScore:   number
  avgSmellsScore:     number
  avgCycleCount:      number
  avgSmellCount:      number
}

export interface AggregatedTrendReport {
  repoUrl: string
  bucket:  BucketSize
  points:  AggregatedPoint[]
  trend:   TrendDirection
}

// ── Module-level trend (from GET /history/trend/modules) ─────────────────────

export interface ModuleTrend {
  module:             string
  trend:              TrendDirection
  currentSmellCount:  number
  previousSmellCount: number
  delta:              number
  /** Smell count per analysis run (chronological) */
  history:            number[]
}

export interface ModuleTrendReport {
  repoUrl: string
  modules: ModuleTrend[]
}
