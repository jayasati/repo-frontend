'use client'

import { useState }   from 'react'
import { useRouter }  from 'next/navigation'
import { toast }      from 'sonner'
import { Button }     from '@/components/ui/button'
import { useAnalysisStore } from '@/features/analysis/store/analysis.store'

const QUICK_PICKS = [
  'https://github.com/nestjs/nest',
  'https://github.com/vercel/next.js',
  'https://github.com/django/django',
  'https://github.com/expressjs/express',
  'https://github.com/gin-gonic/gin',
]

/**
 * UrlScanner — scans any public GitHub URL.
 *
 * Normalises the input so the user can type either:
 *   - owner/repo
 *   - https://github.com/owner/repo
 *
 * Calls POST /api/analyze (our Next.js proxy route) and stores the returned
 * jobId in the Zustand store before navigating to /analyze/:jobId.
 */
export function UrlScanner() {
  const router        = useRouter()
  const setCurrentJobId = useAnalysisStore((s) => s.setCurrentJobId)

  const [rawInput,     setRawInput]     = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function normalise(raw: string): string | null {
    const trimmed = raw.trim()
    if (!trimmed) return null
    if (trimmed.startsWith('https://github.com/')) return trimmed
    if (/^[\w.-]+\/[\w.-]+$/.test(trimmed)) return `https://github.com/${trimmed}`
    return null
  }

  const handleSubmit = async (overrideUrl?: string) => {
    const source = normalise(overrideUrl ?? rawInput)
    if (!source) {
      toast.error('Enter a GitHub URL or owner/repo path')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/analyze', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ source }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { message?: string }
        toast.error(body.message ?? `Error ${res.status}`)
        return
      }

      const { jobId } = await res.json() as { jobId: string }
      setCurrentJobId(jobId)
      router.push(`/analyze/${jobId}`)
    } catch {
      toast.error('Network error — is the backend running?')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Input bar */}
      <div className="flex border border-border-2 rounded-lg overflow-hidden bg-bg-surface focus-within:border-accent transition-colors">
        <span className="flex items-center px-3 bg-bg-surface2 border-r border-border font-mono text-[12px] text-text-dim whitespace-nowrap">
          github.com /
        </span>
        <input
          type="text"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void handleSubmit()}
          placeholder="owner/repo  or  full GitHub URL"
          className="flex-1 bg-transparent outline-none px-3 py-3 font-mono text-[13px] text-text placeholder:text-text-dim caret-accent"
          spellCheck={false}
          autoComplete="off"
        />
        <Button
          variant="accent"
          size="md"
          loading={isSubmitting}
          onClick={() => void handleSubmit()}
          className="rounded-none px-5 font-mono text-[12px]"
        >
          ANALYZE →
        </Button>
      </div>

      {/* Quick picks */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-[11px] text-text-dim">quick pick:</span>
        {QUICK_PICKS.map((url) => {
          const short = url.replace('https://github.com/', '')
          return (
            <button
              key={url}
              type="button"
              onClick={() => { setRawInput(url); void handleSubmit(url) }}
              disabled={isSubmitting}
              className="font-mono text-[12px] text-ra-blue hover:underline underline-offset-4 disabled:opacity-40"
            >
              {short}
            </button>
          )
        })}
      </div>

      {/* Privacy note */}
      <div className="flex items-start gap-2 p-3 bg-bg-surface2 rounded-lg border border-border">
        <span className="text-text-dim text-[13px] flex-shrink-0 mt-px">ℹ</span>
        <p className="text-[12px] text-text-dim leading-relaxed">
          The repo is cloned into a secure temp directory, analyzed, and deleted immediately.
          No source code is stored.
        </p>
      </div>
    </div>
  )
}
