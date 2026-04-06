'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { JobProgressEvent, JobStatus }          from '@/types/analysis.types'

export interface SSEState {
  status:    JobStatus | 'idle'
  message:   string
  progress:  number
  error:     string | null
  isActive:  boolean
}

const INITIAL_STATE: SSEState = {
  status:   'idle',
  message:  '',
  progress: 0,
  error:    null,
  isActive: false,
}

/**
 * useAnalysisSSE — subscribes to the NestJS SSE progress stream via the
 * Next.js proxy route (/api/analyze/:jobId/progress).
 *
 * Race-condition fix: the NestJS queue processor emits `cloning` and
 * `analyzing` events almost immediately after a job starts. By the time the
 * browser establishes an EventSource connection those events are already gone,
 * leaving the progress bar frozen at 0%.
 *
 * Solution: run a polling loop alongside SSE that calls
 * GET /api/analyze/:jobId every POLL_INTERVAL_MS. The moment the backend
 * returns 200 (result is in Redis cache) we know the job is complete and
 * call onComplete — regardless of whether the SSE `complete` event was
 * received. The SSE stream still drives the live step animation while the
 * job is in-flight; polling is purely the completion safety-net.
 */

const POLL_INTERVAL_MS = 3_000   // check every 3 s
const FAKE_PROGRESS_STEPS = [
  { progress: 10,  status: 'cloning'   as JobStatus, message: 'Cloning repository…'              },
  { progress: 30,  status: 'scanning'  as JobStatus, message: 'Building dependency graph…'       },
  { progress: 55,  status: 'analyzing' as JobStatus, message: 'Running cycle + smell detection…' },
  { progress: 75,  status: 'analyzing' as JobStatus, message: 'Computing metrics & score…'       },
  { progress: 90,  status: 'analyzing' as JobStatus, message: 'Generating PlantUML diagrams…'    },
]

export function useAnalysisSSE(
  jobId:      string | null,
  onComplete: () => void,
  onFailed?:  (message: string) => void,
) {
  const [state, setState] = useState<SSEState>(INITIAL_STATE)

  const esRef           = useRef<EventSource | null>(null)
  const pollTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const fakeTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const completedRef    = useRef(false)   // prevent double-firing onComplete
  const fakeStepRef     = useRef(0)

  const cleanup = useCallback(() => {
    esRef.current?.close()
    esRef.current = null

    if (pollTimerRef.current)  { clearInterval(pollTimerRef.current);  pollTimerRef.current  = null }
    if (fakeTimerRef.current)  { clearInterval(fakeTimerRef.current);  fakeTimerRef.current  = null }

    setState((s) => ({ ...s, isActive: false }))
  }, [])

  const handleComplete = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    cleanup()
    setState({
      status:   'complete',
      message:  'Analysis complete',
      progress: 100,
      error:    null,
      isActive: false,
    })
    onComplete()
  }, [cleanup, onComplete])

  useEffect(() => {
    if (!jobId) return

    completedRef.current = false
    fakeStepRef.current  = 0

    setState({ ...INITIAL_STATE, isActive: true, status: 'queued', progress: 5, message: 'Queued…' })

    // ── 1. SSE stream ────────────────────────────────────────────────────────
    const es = new EventSource(`/api/analyze/${jobId}/progress`)
    esRef.current = es

    es.onmessage = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as JobProgressEvent
        setState({
          status:   data.status,
          message:  data.message,
          progress: data.progress,
          error:    null,
          isActive: data.status !== 'complete' && data.status !== 'failed',
        })
        if (data.status === 'complete') handleComplete()
        if (data.status === 'failed') {
          cleanup()
          onFailed?.(data.message)
        }
      } catch {
        // keepalive comment lines — ignore
      }
    }

    es.onerror = () => {
      setState((s) => {
        if (s.status === 'complete' || s.status === 'failed') return s
        return { ...s, error: 'Connection lost — retrying…', isActive: false }
      })
    }

    // ── 2. Fake progress animation (advances steps every 8 s) ────────────────
    // Gives the user visual feedback even when SSE events are missed.
    fakeTimerRef.current = setInterval(() => {
      if (completedRef.current) return
      const step = FAKE_PROGRESS_STEPS[fakeStepRef.current]
      if (!step) return
      fakeStepRef.current += 1
      setState((prev) => {
        // Only advance if SSE hasn't already moved us further
        if (prev.progress >= step.progress) return prev
        return {
          ...prev,
          status:   step.status,
          message:  step.message,
          progress: step.progress,
        }
      })
    }, 8_000)

    // ── 3. Polling fallback ──────────────────────────────────────────────────
    // Polls GET /api/analyze/:jobId every 3 s. The moment the result lands in
    // the backend Redis cache (HTTP 200) we treat the job as complete.
    pollTimerRef.current = setInterval(async () => {
      if (completedRef.current) return
      try {
        const res = await fetch(`/api/analyze/${jobId}`)
        if (res.ok) handleComplete()
      } catch {
        // network blip — retry next interval
      }
    }, POLL_INTERVAL_MS)

    return cleanup
  }, [jobId, cleanup, handleComplete, onFailed])

  return state
}