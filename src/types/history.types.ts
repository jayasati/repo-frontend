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

export interface AnalysisDiff {
  from:        { id: string; analyzedAt: string; score: number }
  to:          { id: string; analyzedAt: string; score: number }
  delta:       DiffDelta
  regression:  boolean
  newSmells:   string[]
  fixedSmells: string[]
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

export interface TrendReport {
  repoUrl:    string
  points:     TrendPoint[]
  trend:      'improving' | 'degrading' | 'stable'
  avgScore:   number
  bestScore:  number
  worstScore: number
}
