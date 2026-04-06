'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter }     from 'next/navigation'
import { MessageSquare }                  from 'lucide-react'
import { Spinner }                        from '@/components/ui/spinner'
import { ChatWindow }                     from '@/components/chat/ChatWindow'
import type { PipelineResult }            from '@/types/analysis.types'

// ── Inner component uses useSearchParams ─────────────────────────────────────
// Must be wrapped in <Suspense> at the page level because Next.js 14 App Router
// requires any component that reads searchParams to be inside a Suspense boundary.

function ChatPageInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const [jobId,     setJobId]     = useState(searchParams.get('jobId') ?? '')
  const [input,     setInput]     = useState(searchParams.get('jobId') ?? '')
  const [result,    setResult]    = useState<PipelineResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!jobId) return
    setIsLoading(true)
    setError(null)
    setResult(null)

    fetch(`/api/analyze/${jobId}`)
      .then((r) => {
        if (r.status === 404) throw new Error('Analysis not found — it may have expired (TTL: 1h).')
        if (!r.ok) return r.json().then((b: { message?: string }) => { throw new Error(b.message ?? `HTTP ${r.status}`) })
        return r.json()
      })
      .then((d: PipelineResult) => setResult(d))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setIsLoading(false))
  }, [jobId])

  const handleLoad = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setJobId(trimmed)
    router.replace(`/chat?jobId=${trimmed}`)
  }

  // ── No jobId yet – show the entry form ─────────────────────────────────────
  if (!jobId) {
    return (
      <div className="p-6 max-w-lg animate-fade-in">
        <div className="mb-8">
          <p className="font-mono text-[11px] text-accent tracking-[0.1em] uppercase mb-2">Chat</p>
          <h1 className="text-[22px] font-medium text-text mb-1">Codebase chat</h1>
          <p className="text-[14px] text-text-muted">
            Enter an analysis job ID, or analyze a repo first then use the chat button on the results page.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
            placeholder="Paste a job ID (UUID)…"
            className="flex-1 bg-bg-surface border border-border rounded-lg px-3 py-2.5 font-mono text-[13px] text-text placeholder:text-text-dim outline-none focus:border-accent caret-accent"
            spellCheck={false}
          />
          <button
            onClick={handleLoad}
            className="px-4 py-2.5 bg-accent text-black rounded-lg font-mono text-[12px] font-medium hover:bg-accent/90 transition-colors"
          >
            Load →
          </button>
        </div>

        <div className="mt-6 flex items-start gap-2 p-3 bg-bg-surface border border-border rounded-lg">
          <MessageSquare className="h-4 w-4 text-text-dim flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-text-muted leading-relaxed">
            After analyzing a repo, click{' '}
            <span className="font-mono text-accent text-[11px]">Open in Chat</span>{' '}
            on the results page to jump here automatically.
          </p>
        </div>
      </div>
    )
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full gap-3 text-text-muted">
        <Spinner size="md" />
        <span className="font-mono text-[13px]">Loading analysis…</span>
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6 max-w-lg">
        <div className="p-4 bg-ra-red-dim border border-ra-red/30 rounded-lg">
          <p className="font-mono text-[13px] text-ra-red mb-3">{error}</p>
          <button
            onClick={() => { setJobId(''); setInput(''); router.replace('/chat') }}
            className="font-mono text-[12px] text-text-muted hover:text-text transition-colors"
          >
            ← Try a different job ID
          </button>
        </div>
      </div>
    )
  }

  if (!result) return null

  // ── Chat view ───────────────────────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-48px)] overflow-hidden">
      <ChatWindow result={result} jobId={jobId} />
    </div>
  )
}

// ── Page shell with Suspense ──────────────────────────────────────────────────
export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full gap-3 text-text-muted">
          <Spinner size="md" />
          <span className="font-mono text-[13px]">Loading…</span>
        </div>
      }
    >
      <ChatPageInner />
    </Suspense>
  )
} 