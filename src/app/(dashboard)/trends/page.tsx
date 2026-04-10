'use client'

import { useEffect, useState, useCallback } from 'react'
import { TrendingUp, Target, Save } from 'lucide-react'
import { TrendChart }   from '@/components/history/TrendChart'
import { ModuleTrends }  from '@/components/history/ModuleTrends'
import { normalizeGithubRepoUrl } from '@/lib/repo-url'
import { getLastAnalyzedRepo } from '@/lib/last-analyzed-repo'

export default function TrendsPage() {
  const [repoUrl, setRepoUrl] = useState('')
  const [input,   setInput]   = useState('')
  const [limit,   setLimit]   = useState(30)

  // Target score
  const [targetScore, setTargetScore] = useState<number | undefined>(undefined)
  const [targetInput, setTargetInput] = useState('')
  const [targetSaving, setTargetSaving] = useState(false)

  // Bucket selector
  const [bucket, setBucket] = useState<'raw' | 'daily' | 'weekly' | 'monthly'>('raw')

  const handleSearch = () => {
    const url = normalizeGithubRepoUrl(input)
    if (url) setRepoUrl(url)
  }

  // Fetch target when repoUrl changes
  useEffect(() => {
    if (!repoUrl) return
    fetch(`/api/history/target?repoUrl=${encodeURIComponent(repoUrl)}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.targetScore) {
          setTargetScore(data.targetScore)
          setTargetInput(String(data.targetScore))
        } else {
          setTargetScore(undefined)
          setTargetInput('')
        }
      })
      .catch(() => {})
  }, [repoUrl])

  const saveTarget = useCallback(() => {
    const val = Number(targetInput)
    if (!repoUrl || isNaN(val) || val < 0 || val > 100) return
    setTargetSaving(true)
    fetch('/api/history/target', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl, targetScore: val }),
    })
      .then((r) => {
        if (r.ok) setTargetScore(val)
      })
      .finally(() => setTargetSaving(false))
  }, [repoUrl, targetInput])

  useEffect(() => {
    const lastRepo = getLastAnalyzedRepo()
    if (!lastRepo) return
    setInput(lastRepo)
    setRepoUrl(lastRepo)
  }, [])

  return (
    <div className="p-6 max-w-4xl animate-fade-in">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-accent tracking-[0.1em] uppercase mb-2">Trends</p>
        <h1 className="text-[22px] font-medium text-text mb-1">Score trends</h1>
        <p className="text-[14px] text-text-muted">Track architecture health over time for any repository.</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex flex-1 border border-border-2 rounded-lg overflow-hidden bg-bg-surface focus-within:border-accent transition-colors">
          <span className="flex items-center px-3 bg-bg-surface2 border-r border-border font-mono text-[12px] text-text-dim whitespace-nowrap">
            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
            github.com /
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="owner/repo  or  full GitHub URL"
            className="flex-1 bg-transparent outline-none px-3 py-2.5 font-mono text-[13px] text-text placeholder:text-text-dim caret-accent"
            spellCheck={false}
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 bg-accent text-black rounded-lg font-mono text-[12px] font-medium hover:bg-accent/90 transition-colors"
        >
          Load
        </button>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-2.5 py-2.5 rounded-lg border border-border bg-bg-surface font-mono text-[12px] text-text"
          aria-label="Trend result limit"
        >
          <option value={30}>30</option>
          <option value={60}>60</option>
          <option value={120}>120</option>
        </select>
      </div>

      {/* Controls row: bucket selector + target score */}
      {repoUrl && (
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Bucket selector */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider">View:</span>
            {(['raw', 'daily', 'weekly', 'monthly'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBucket(b)}
                className={`px-2 py-1 rounded font-mono text-[11px] border transition-colors ${
                  bucket === b
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-border text-text-dim hover:text-text'
                }`}
              >
                {b === 'raw' ? 'All points' : b}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Target score input */}
          <div className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-text-dim" />
            <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider">Target:</span>
            <input
              type="number"
              min={0}
              max={100}
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveTarget()}
              placeholder="80"
              className="w-14 px-2 py-1 rounded border border-border bg-bg-surface font-mono text-[12px] text-text text-center outline-none focus:border-accent"
            />
            <button
              onClick={saveTarget}
              disabled={targetSaving}
              className="p-1 rounded hover:bg-accent/10 text-text-dim hover:text-accent transition-colors disabled:opacity-50"
              title="Save target"
            >
              <Save className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {repoUrl ? (
        <div className="space-y-8">
          <TrendChart
            repoUrl={repoUrl}
            limit={limit}
            targetScore={targetScore}
            bucket={bucket === 'raw' ? undefined : bucket}
          />
          <ModuleTrends repoUrl={repoUrl} limit={limit} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <TrendingUp className="h-8 w-8 text-text-dim" />
          <p className="text-[14px] text-text-muted">Enter a repository URL above to see its score trend.</p>
          <p className="font-mono text-[11px] text-text-dim">Requires at least 2 analyses in history.</p>
        </div>
      )}
    </div>
  )
}
