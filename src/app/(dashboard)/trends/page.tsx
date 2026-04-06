'use client'

import { useEffect, useState } from 'react'
import { TrendingUp }   from 'lucide-react'
import { TrendChart }   from '@/components/history/TrendChart'
import { normalizeGithubRepoUrl } from '@/lib/repo-url'
import { getLastAnalyzedRepo } from '@/lib/last-analyzed-repo'

export default function TrendsPage() {
  const [repoUrl, setRepoUrl] = useState('')
  const [input,   setInput]   = useState('')
  const [limit,   setLimit]   = useState(30)

  const handleSearch = () => {
    const url = normalizeGithubRepoUrl(input)
    if (url) setRepoUrl(url)
  }

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

      <div className="flex gap-2 mb-6">
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
          Load →
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

      {repoUrl
        ? <TrendChart repoUrl={repoUrl} limit={limit} />
        : (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <TrendingUp className="h-8 w-8 text-text-dim" />
            <p className="text-[14px] text-text-muted">Enter a repository URL above to see its score trend.</p>
            <p className="font-mono text-[11px] text-text-dim">Requires at least 2 analyses in history.</p>
          </div>
        )
      }
    </div>
  )
}
