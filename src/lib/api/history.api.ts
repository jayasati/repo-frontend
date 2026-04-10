import type { PaginatedHistory, AnalysisDiff, TrendReport, AggregatedTrendReport, BucketSize, ModuleTrendReport } from '@/types/history.types'
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
  cursor?:     string,
): Promise<PaginatedHistory> {
  const params = new URLSearchParams({ repoUrl, limit: String(limit) })
  if (cursor) params.set('cursor', cursor)
  return apiFetch<PaginatedHistory>(`/history?${params}`, {
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

/**
 * GET /history/trend/aggregated?repoUrl=&bucket=&limit=
 * Returns time-bucketed (daily/weekly/monthly) aggregated trend data.
 */
export async function getAggregatedTrend(
  repoUrl:     string,
  bucket:      BucketSize = 'weekly',
  limit        = 100,
  accessToken: string,
): Promise<AggregatedTrendReport> {
  const params = new URLSearchParams({ repoUrl, bucket, limit: String(limit) })
  return apiFetch<AggregatedTrendReport>(`/history/trend/aggregated?${params}`, {
    method: 'GET',
    accessToken,
  })
}

/**
 * GET /history/trend/modules?repoUrl=&limit=
 * Returns per-module smell trends over time.
 */
export async function getModuleTrends(
  repoUrl:     string,
  limit        = 20,
  accessToken: string,
): Promise<ModuleTrendReport> {
  const params = new URLSearchParams({ repoUrl, limit: String(limit) })
  return apiFetch<ModuleTrendReport>(`/history/trend/modules?${params}`, {
    method: 'GET',
    accessToken,
  })
}
