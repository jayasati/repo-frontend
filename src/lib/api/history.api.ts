import type { HistoryEntry, AnalysisDiff, TrendReport } from '@/types/history.types'
import { apiFetch } from './client'

/**
 * GET /history?repoUrl=&limit=
 * Returns past analysis entries for a given repo URL.
 * Requires a valid Bearer token — protected by JwtAuthGuard.
 */
export async function getHistory(
  repoUrl:     string,
  limit        = 20,
  accessToken: string,
): Promise<HistoryEntry[]> {
  const params = new URLSearchParams({ repoUrl, limit: String(limit) })
  return apiFetch<HistoryEntry[]>(`/history?${params}`, {
    method: 'GET',
    accessToken,
  })
}

/**
 * GET /history/diff?from=&to=
 * Compares two analysis results by their IDs.
 */
export async function getDiff(
  fromId:      string,
  toId:        string,
  accessToken: string,
): Promise<AnalysisDiff> {
  const params = new URLSearchParams({ from: fromId, to: toId })
  return apiFetch<AnalysisDiff>(`/history/diff?${params}`, {
    method: 'GET',
    accessToken,
  })
}

/**
 * GET /history/trend?repoUrl=&limit=
 * Returns time-series score data for trend chart rendering.
 */
export async function getTrend(
  repoUrl:     string,
  limit        = 30,
  accessToken: string,
): Promise<TrendReport> {
  const params = new URLSearchParams({ repoUrl, limit: String(limit) })
  return apiFetch<TrendReport>(`/history/trend?${params}`, {
    method: 'GET',
    accessToken,
  })
}
