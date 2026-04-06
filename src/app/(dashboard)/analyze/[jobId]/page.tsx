'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter }                       from 'next/navigation'
import { toast }                                      from 'sonner'
import { AlertCircle, ArrowLeft }                     from 'lucide-react'

import { useAnalysisSSE }    from '@/hooks/useAnalysisSSE'
import { useAnalysisStore }  from '@/features/analysis/store/analysis.store'
import { LoadingSteps }      from '@/components/analysis/LoadingSteps'
import { AnalyzeResultsView } from '@/components/analysis/AnalyzeResultsView'
import { Button }            from '@/components/ui/button'
import { Spinner }           from '@/components/ui/spinner'
import type { PipelineResult } from '@/types/analysis.types'

/**
 * /analyze/[jobId] — Client Component.
 *
 * State machine:
 *   idle → (SSE + polling) → complete → show AnalyzeResultsView
 *                          ↘ error   → show error state
 *
 * Why two mechanisms?
 * The NestJS queue processor emits `cloning` / `analyzing` progress events
 * almost immediately after a job starts. If the browser SSE connection is
 * established even a few hundred milliseconds late those events are already
 * gone and the progress bar freezes.
 *
 * useAnalysisSSE now runs a 3-second polling loop alongside the SSE stream.
 * The moment GET /api/analyze/:jobId returns 200 (result is in Redis) the
 * hook fires onComplete and we fetch + display the full result.
 */
export default function JobPage() {
  const params  = useParams<{ jobId: string }>()
  const router  = useRouter()
  const jobId   = params.jobId

  const { getCachedResult, cacheResult } = useAnalysisStore()

  const [result,     setResult]     = useState<PipelineResult | null>(() => getCachedResult(jobId))
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const fetchedRef                  = useRef(false)   // prevent double-fetch

  // ── Fetch the full result once we know the job is complete ────────────────
  const fetchResult = useCallback(async () => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    // Check in-memory cache first (back-navigation)
    const cached = getCachedResult(jobId)
    if (cached) { setResult(cached); return }

    setIsFetching(true)
    try {
      const res = await fetch(`/api/analyze/${jobId}`)

      if (res.status === 404) {
        setFetchError('Analysis result not found. It may have expired (TTL: 1h).')
        return
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { message?: string }
        setFetchError(body.message ?? `HTTP ${res.status}`)
        return
      }

      const data = await res.json() as PipelineResult
      cacheResult(jobId, data)
      setResult(data)
    } catch {
      // fetchedRef stays true so we don't retry in a loop, but reset the
      // guard so the user can manually retry via the error CTA.
      fetchedRef.current = false
      setFetchError('Network error while fetching result. Please try again.')
    } finally {
      setIsFetching(false)
    }
  }, [jobId, getCachedResult, cacheResult])

  // ── SSE subscription (includes polling fallback) ──────────────────────────
  const onFailed = useCallback((msg: string) => {
    setFetchError(msg || 'Analysis failed. Please try again.')
    toast.error('Analysis failed.')
  }, [])

  const sseState = useAnalysisSSE(
    result ? null : jobId,   // don't subscribe if we already have a result
    fetchResult,
    onFailed,
  )

  // ── On mount: try an immediate fetch in case the job already finished ─────
  useEffect(() => {
    if (result) return   // already have it from cache
    fetchedRef.current = false   // allow the attempt

    const tryNow = async () => {
      const res = await fetch(`/api/analyze/${jobId}`).catch(() => null)
      if (!res?.ok) return   // still in-flight — SSE + polling will handle it
      const data = await res.json().catch(() => null) as PipelineResult | null
      if (data) {
        fetchedRef.current = true
        cacheResult(jobId, data)
        setResult(data)
      }
    }

    void tryNow()
  }, [jobId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ─────────────────────────────────────────────────────────────────

  if (fetchError) {
    return (
      <div className="p-6 max-w-xl">
        <div className="flex flex-col items-center text-center gap-4 py-16">
          <AlertCircle className="h-10 w-10 text-ra-red" />
          <div>
            <p className="text-[16px] font-medium text-text mb-2">Analysis failed</p>
            <p className="text-[13px] text-text-muted">{fetchError}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="md" onClick={() => router.push('/analyze')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isFetching) {
    return (
      <div className="p-6 max-w-xl flex items-center justify-center py-24 gap-3 text-text-muted">
        <Spinner size="md" />
        <span className="font-mono text-[13px]">Loading analysis result…</span>
      </div>
    )
  }

  if (result) {
    return (
      <div className="p-6 max-w-5xl">
        <button
          type="button"
          onClick={() => router.push('/analyze')}
          className="flex items-center gap-2 font-mono text-[12px] text-text-muted hover:text-text mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          New analysis
        </button>

        <AnalyzeResultsView result={result} jobId={jobId} />
      </div>
    )
  }

  // SSE progress view (analysis in flight)
  return (
    <div className="p-6 max-w-xl">
      <button
        type="button"
        onClick={() => router.push('/analyze')}
        className="flex items-center gap-2 font-mono text-[12px] text-text-muted hover:text-text mb-8 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Cancel
      </button>

      <div className="text-center mb-8">
        <p className="font-mono text-[11px] text-accent tracking-[0.1em] uppercase mb-2">
          Analysis in progress
        </p>
        <h1 className="text-[20px] font-medium text-text">
          Analyzing repository…
        </h1>
        <p className="text-[13px] text-text-muted mt-1 font-mono break-all">
          job {jobId.slice(0, 8)}…
        </p>
      </div>

      <LoadingSteps
        status={sseState.status}
        message={sseState.message}
        progress={sseState.progress}
      />

      <p className="font-mono text-[11px] text-text-dim text-center mt-6">
        Results will appear automatically when the analysis completes.
      </p>
    </div>
  )
}