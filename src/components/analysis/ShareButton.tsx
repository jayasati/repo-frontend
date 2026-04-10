'use client'

import { useState, useCallback } from 'react'
import { Share2, Copy, Check, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ShareButtonProps {
  jobId: string
}

interface ShareResult {
  shareToken: string
  shareUrl: string
  expiresAt?: string
}

export function ShareButton({ jobId }: ShareButtonProps) {
  const [isOpen,    setIsOpen]    = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result,    setResult]    = useState<ShareResult | null>(null)
  const [copied,    setCopied]    = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [expDays,   setExpDays]   = useState(7)

  const createShare = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/report/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, expiresInDays: expDays }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message ?? 'Failed to create share link')
      }
      const data: ShareResult = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setIsLoading(false)
    }
  }, [jobId, expDays])

  const copyLink = useCallback(() => {
    if (!result) return
    // Build full URL from the backend share URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
    const fullUrl = `${backendUrl}${result.shareUrl}`
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [result])

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-bg-surface font-mono text-[12px] text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-bg-surface border border-border rounded-lg p-4 shadow-lg z-50">
          <p className="font-mono text-[11px] text-text-dim mb-3">
            Create a public link to share this report (no login required).
          </p>

          {!result ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[11px] text-text-dim">Expires in:</span>
                <select
                  value={expDays}
                  onChange={(e) => setExpDays(Number(e.target.value))}
                  className="px-2 py-1 rounded border border-border bg-bg font-mono text-[11px] text-text"
                >
                  <option value={1}>1 day</option>
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={0}>Never</option>
                </select>
              </div>

              <button
                onClick={createShare}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg bg-accent text-black font-mono text-[12px] font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating…' : 'Create share link'}
              </button>

              {error && (
                <p className="font-mono text-[11px] text-ra-red mt-2">{error}</p>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/backend${result.shareUrl}`}
                  className="flex-1 px-2 py-1.5 rounded border border-border bg-bg font-mono text-[10px] text-text truncate"
                />
                <button
                  onClick={copyLink}
                  className="p-1.5 rounded hover:bg-accent/10 transition-colors"
                  title="Copy link"
                >
                  {copied
                    ? <Check className="h-3.5 w-3.5 text-accent" />
                    : <Copy className="h-3.5 w-3.5 text-text-dim" />
                  }
                </button>
                <a
                  href={`/backend${result.shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded hover:bg-accent/10 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-text-dim" />
                </a>
              </div>
              {result.expiresAt && (
                <p className="font-mono text-[10px] text-text-dim">
                  Expires: {new Date(result.expiresAt).toLocaleDateString()}
                </p>
              )}
              <button
                onClick={() => { setResult(null); setIsOpen(false) }}
                className="font-mono text-[11px] text-text-dim hover:text-text transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
