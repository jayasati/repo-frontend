import { create } from 'zustand'
import type { PipelineResult } from '@/types/analysis.types'

interface AnalysisState {
  // Current active job
  currentJobId: string | null
  // Per-job result cache  (jobId → result)
  resultCache:  Record<string, PipelineResult>

  // Actions
  setCurrentJobId: (jobId: string | null) => void
  cacheResult:     (jobId: string, result: PipelineResult) => void
  getCachedResult: (jobId: string) => PipelineResult | null
  clearJob:        () => void
}

/**
 * Lightweight Zustand store for analysis state.
 *
 * Why Zustand instead of useState?
 * - The jobId set on the /analyze page must survive the navigation to /analyze/:jobId.
 * - The result cache prevents a second fetch if the user navigates back.
 * - No Context provider needed — the store is a singleton.
 *
 * Not persisted to localStorage — a page refresh intentionally resets state.
 * The backend Redis cache (TTL 1h) is the persistence layer.
 */
export const useAnalysisStore = create<AnalysisState>()((set, get) => ({
  currentJobId: null,
  resultCache:  {},

  setCurrentJobId: (jobId) => set({ currentJobId: jobId }),

  cacheResult: (jobId, result) =>
    set((s) => ({
      resultCache: { ...s.resultCache, [jobId]: result },
    })),

  getCachedResult: (jobId) => get().resultCache[jobId] ?? null,

  clearJob: () => set({ currentJobId: null }),
}))
