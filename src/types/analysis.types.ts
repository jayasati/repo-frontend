/**
 * Analysis types — mirror the NestJS PipelineResult and related interfaces.
 * Keep in sync with:
 *   src/core/pipeline/pipeline-result.type.ts
 *   src/analysis/**\/*.types.ts
 */

// ── Detection ─────────────────────────────────────────────────────────────────

export type DetectedFramework =
  | 'nestjs' | 'nextjs' | 'angular' | 'express' | 'fastify' | 'koa'
  | 'django' | 'flask' | 'fastapi'
  | 'spring' | 'micronaut' | 'ktor'
  | 'gin' | 'fiber' | 'echo'
  | 'rails' | 'sinatra'
  | 'laravel' | 'symfony'
  | 'actix' | 'axum' | 'rocket'
  | 'vapor' | 'phoenix' | 'play' | 'akka'
  | 'flutter' | 'aspnet'

export type DetectedOrm =
  | 'prisma' | 'typeorm' | 'sequelize' | 'mongoose'
  | 'hibernate' | 'jpa'
  | 'sqlalchemy' | 'django-orm'
  | 'activerecord' | 'eloquent'
  | 'diesel' | 'sqlx'
  | 'exposed' | 'ktorm'
  | 'slick' | 'doobie'

export interface DetectedLanguage {
  name:       string
  confidence: number
}

export interface DetectionResult {
  languages:     DetectedLanguage[]
  framework?:    DetectedFramework
  orm?:          DetectedOrm
  analysisDepth: 'framework' | 'structural'
}

// ── Score ─────────────────────────────────────────────────────────────────────

export interface ArchitectureScore {
  overall: number
  breakdown: {
    modularity: number
    coupling:   number
    smells:     number
  }
  noData?: boolean
}

// ── Metrics ───────────────────────────────────────────────────────────────────

export interface ArchitectureMetrics {
  moduleCount:       number
  dependencyCount:   number
  cycleCount:        number
  averageFanIn:      number
  averageFanOut:     number
  dependencyDensity: number
  maxFanOut:         number
}

// ── Smells ────────────────────────────────────────────────────────────────────

export type SmellType =
  | 'god-module'
  | 'hub-dependency'
  | 'dead-module'
  | 'circular-dependency'
  | 'unstable-abstraction'
  | 'god-file'
  | 'package-tangle'
  | 'deep-hierarchy'
  | 'scattered-functionality'

export interface ArchitectureSmell {
  type:     SmellType
  message:  string
  severity: 'low' | 'medium' | 'high'
  module?:  string
  details?: Record<string, unknown>
}

// ── Health ────────────────────────────────────────────────────────────────────

export interface ArchitectureHealth {
  score:      number
  strengths:  string[]
  weaknesses: string[]
}

// ── Hotspots ──────────────────────────────────────────────────────────────────

export interface Hotspot {
  module: string
  fanOut: number
  risk:   'low' | 'medium' | 'high'
}

// ── Confidence ────────────────────────────────────────────────────────────────

export interface ConfidenceResult {
  score:   number
  factors: {
    repoSizeFactor: number
    cyclePenalty:   number
    smellPenalty:   number
    stability:      number
  }
}

// ── Baseline ──────────────────────────────────────────────────────────────────

export interface BaselineComparison {
  name:       string
  similarity: number
}

// ── Impact ────────────────────────────────────────────────────────────────────

export interface ImpactResult {
  target:   string
  affected: string[]
}

// ── Summary ───────────────────────────────────────────────────────────────────

export interface RepoSummary {
  project:          string
  language?:        string
  framework?:       string
  files:            number
  dependencies:     number
  modules:          number
  cycles:           number
  smells:           number
  architectureScore: number
}

// ── Graph ─────────────────────────────────────────────────────────────────────

export interface GraphNode {
  id:     string
  type:   'file' | 'class' | 'module' | 'service' | 'controller' | 'unknown'
  source: 'structural' | 'semantic'
}

export interface GraphEdge {
  from: string
  to:   string
  type: 'import' | 'constructor-injection' | 'module-import' | 'module-provider' | 'module-controller'
}

export interface UnifiedGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

// ── Full pipeline result ──────────────────────────────────────────────────────

export interface PipelineResult {
  projectName:  string
  summary:      RepoSummary
  health:       ArchitectureHealth
  confidence:   ConfidenceResult
  baseline:     BaselineComparison[]
  detection:    DetectionResult
  unifiedGraph: UnifiedGraph
  metrics:      ArchitectureMetrics
  smells:       ArchitectureSmell[]
  cycles:       { nodes: string[] }[]
  hotspots:     Hotspot[]
  impact?:      ImpactResult
  score:        ArchitectureScore
  diagrams?: {
    classDiagram?:     string
    componentDiagram?: string
    sequenceDiagram?:  string
  }
}

// ── Job / SSE ─────────────────────────────────────────────────────────────────

export type JobStatus =
  | 'queued'
  | 'cloning'
  | 'scanning'
  | 'analyzing'
  | 'complete'
  | 'failed'

export interface JobProgressEvent {
  jobId:    string
  status:   JobStatus
  message:  string
  progress: number   // 0–100
}

export interface EnqueueResponse {
  jobId: string
}

// ── GitHub repo (for repo picker) ─────────────────────────────────────────────

export interface GitHubRepo {
  id:              number
  name:            string
  full_name:       string
  private:         boolean
  html_url:        string
  description:     string | null
  language:        string | null
  default_branch:  string
  updated_at:      string
  stargazers_count: number
}
