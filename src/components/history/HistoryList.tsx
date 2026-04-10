'use client'

import { useState, useEffect, useCallback } from 'react'
import Link                    from 'next/link'
import { ArrowUpRight }        from 'lucide-react'
import { cn }                  from '@/lib/utils/cn'
import { Spinner }             from '@/components/ui/spinner'
import { EmptyState }          from '@/components/ui/empty-state'
import type { HistoryEntry, PaginatedHistory } from '@/types/history.types'

interface HistoryListProps {
  repoUrl:         string
  limit:           number
  onSelectForDiff: (entry: HistoryEntry) => void
  selected:        HistoryEntry[]
}

function scoreColor(n: number) {
  if (n >= 80) return 'text-accent'
  if (n >= 60) return 'text-ra-amber'
  return 'text-ra-red'
}
function scoreBg(n: number) {
  if (n >= 80) return 'bg-accent/10'
  if (n >= 60) return 'bg-ra-amber-dim'
  return 'bg-ra-red-dim'
}

export function HistoryList({ repoUrl, limit, onSelectForDiff, selected }: HistoryListProps) {
  const [entries,    setEntries]    = useState<HistoryEntry[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [isLoadMore, setIsLoadMore] = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore,    setHasMore]    = useState(false)
  const [refreshTick, setRefreshTick] = useState(0)

  // Initial load
  useEffect(() => {
    if (!repoUrl) return
    setIsLoading(true)
    setError(null)
    setEntries([])
    setNextCursor(null)

    fetch(`/api/history?repoUrl=${encodeURIComponent(repoUrl)}&limit=${limit}&_ts=${Date.now()}`)
      .then((r) => r.ok ? r.json() : r.json().then((b: {message?: string}) => Promise.reject(b.message ?? 'Failed')))
      .then((data: PaginatedHistory) => {
        setEntries(data.items)
        setNextCursor(data.nextCursor)
        setHasMore(data.hasMore)
      })
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setIsLoading(false))
  }, [repoUrl, limit, refreshTick])

  // Refresh on window focus, throttled to once per 60 seconds
  useEffect(() => {
    if (!repoUrl) return
    let lastRefresh = Date.now()
    const onFocus = () => {
      if (Date.now() - lastRefresh > 60_000) {
        lastRefresh = Date.now()
        setRefreshTick((n) => n + 1)
      }
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [repoUrl])

  // Load more (pagination)
  const loadMore = useCallback(() => {
    if (!nextCursor || isLoadMore) return
    setIsLoadMore(true)

    fetch(`/api/history?repoUrl=${encodeURIComponent(repoUrl)}&limit=${limit}&cursor=${encodeURIComponent(nextCursor)}&_ts=${Date.now()}`)
      .then((r) => r.ok ? r.json() : r.json().then((b: {message?: string}) => Promise.reject(b.message ?? 'Failed')))
      .then((data: PaginatedHistory) => {
        setEntries((prev) => [...prev, ...data.items])
        setNextCursor(data.nextCursor)
        setHasMore(data.hasMore)
      })
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setIsLoadMore(false))
  }, [repoUrl, limit, nextCursor, isLoadMore])

  if (isLoading) return (
    <div className="flex items-center gap-2 py-8 text-text-muted">
      <Spinner size="sm" /><span className="font-mono text-[12px]">Loading history…</span>
    </div>
  )

  if (error) return (
    <div className="font-mono text-[12px] text-ra-red py-4">{error}</div>
  )

  if (entries.length === 0) return (
    <EmptyState message="No history found for this repository yet." />
  )

  return (
    <div className="flex flex-col gap-1.5">
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_60px_60px_60px_60px_100px_32px] gap-3 px-3 pb-1">
        {['Date', 'Score', 'Cycles', 'Smells', 'Modules', 'Framework', ''].map((h) => (
          <span key={h} className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em]">{h}</span>
        ))}
      </div>

      {entries.map((entry) => {
        const isSelected = selected.some((s) => s.id === entry.id)

        return (
          <div
            key={entry.id}
            className={cn(
              'grid grid-cols-[1fr_60px_60px_60px_60px_100px_32px] gap-3 items-center',
              'px-3 py-2.5 rounded-lg border transition-colors cursor-pointer',
              isSelected
                ? 'border-accent bg-accent/5'
                : 'border-border bg-bg hover:border-border-2 hover:bg-bg-surface',
            )}
            onClick={() => onSelectForDiff(entry)}
          >
            <div>
              <p className="font-mono text-[12px] text-text">
                {new Date(entry.analyzedAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </p>
              <p className="font-mono text-[10px] text-text-dim">
                {new Date(entry.analyzedAt).toLocaleTimeString('en-US', {
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>

            <div className={cn('rounded px-1.5 py-0.5 text-center', scoreBg(entry.overallScore))}>
              <span className={cn('font-mono text-[13px] font-medium', scoreColor(entry.overallScore))}>
                {entry.overallScore}
              </span>
            </div>

            <span className={cn('font-mono text-[12px]', entry.cycleCount > 0 ? 'text-ra-red' : 'text-text-muted')}>
              {entry.cycleCount}
            </span>

            <span className={cn('font-mono text-[12px]', entry.smellCount > 0 ? 'text-ra-amber' : 'text-text-muted')}>
              {entry.smellCount}
            </span>

            <span className="font-mono text-[12px] text-text-muted">{entry.moduleCount}</span>

            <span className="font-mono text-[11px] text-text-dim truncate">
              {entry.detectedFramework ?? entry.detectedLanguage ?? '—'}
            </span>

            <Link
              href={`/analyze/${entry.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center text-text-dim hover:text-accent transition-colors"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )
      })}

      {/* Load more button */}
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isLoadMore}
          className="mt-2 py-2 text-center font-mono text-[12px] text-text-muted hover:text-accent border border-border rounded-lg hover:border-accent/30 transition-colors disabled:opacity-50"
        >
          {isLoadMore ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner size="sm" /> Loading…
            </span>
          ) : (
            'Load more'
          )}
        </button>
      )}

      {/* Diff selection hint */}
      {selected.length > 0 && (
        <p className="font-mono text-[11px] text-text-dim mt-1 text-center">
          {selected.length === 1
            ? 'Select a second entry to compare'
            : `Comparing ${selected[0]?.analyzedAt.slice(0, 10)} vs ${selected[1]?.analyzedAt.slice(0, 10)}`
          }
        </p>
      )}
    </div>
  )
}
