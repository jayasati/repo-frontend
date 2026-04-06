import type { EnqueueResponse, PipelineResult } from '@/types/analysis.types'
import { apiFetch } from './client'

// ── Enqueue ───────────────────────────────────────────────────────────────────

export interface AnalyzePayload {
  source:  string        // GitHub URL or local path
  branch?: string        // optional branch override
  subdir?: string        // optional subdirectory to analyze
}

/**
 * POST /analyze
 * Queues an analysis job and returns the jobId immediately (202 Accepted).
 * The client then polls GET /analyze/:jobId or streams SSE progress.
 */
export async function enqueueAnalysis(
  payload: AnalyzePayload,
  /** Nest JWT — optional; GitHub-only NextAuth sessions may omit it (backend /analyze is open). */
  accessToken?: string,
): Promise<EnqueueResponse> {
  return apiFetch<EnqueueResponse>('/analyze', {
    method: 'POST',
    body:   payload,
    accessToken,
  })
}

// ── Result ────────────────────────────────────────────────────────────────────

/**
 * GET /analyze/:jobId
 * Fetches the completed analysis result from the backend Redis cache.
 * Returns null (via thrown ApiError 404) if not yet complete.
 */
export async function getAnalysisResult(
  jobId: string,
  accessToken?: string,
): Promise<PipelineResult> {
  return apiFetch<PipelineResult>(`/analyze/${jobId}`, {
    method: 'GET',
    accessToken,
  })
}

// ── Report download ───────────────────────────────────────────────────────────

export type ReportFormat = 'markdown' | 'html' | 'json'

/**
 * GET /analyze/:jobId/report?format=
 * Downloads a formatted report from the backend.
 * Returns the raw response so the caller can trigger a browser download.
 */
export async function downloadReport(
  jobId:       string,
  format:      ReportFormat,
  accessToken: string,
): Promise<Response> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
  return fetch(`${base}/analyze/${jobId}/report?format=${format}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}
