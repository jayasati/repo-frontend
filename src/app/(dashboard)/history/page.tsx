'use client'

import { useState }          from 'react'
import { GitBranch }         from 'lucide-react'
import { HistoryList }       from '@/components/history/HistoryList'
import { DiffView }          from '@/components/history/DiffView'
import type { HistoryEntry } from '@/types/history.types'

export default function HistoryPage() {
  const [repoUrl,  setRepoUrl]  = useState('')
  const [input,    setInput]    = useState('')
  const [selected, setSelected] = useState<HistoryEntry[]>([])

  const handleSearch = () => {
    const url = input.trim().startsWith('http')
      ? input.trim()
      : input.trim() ? `https://github.com/${input.trim()}` : ''
    if (!url) return
    setRepoUrl(url)
    setSelected([])
  }

  const handleSelectForDiff = (entry: HistoryEntry) => {
    setSelected((prev) => {
      if (prev.some((e) => e.id === entry.id)) return prev.filter((e) => e.id !== entry.id)
      if (prev.length >= 2) return [prev[1]!, entry]
      return [...prev, entry]
    })
  }

  const canDiff = selected.length === 2

  return (
    <div className="p-6 max-w-5xl animate-fade-in">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-accent tracking-[0.1em] uppercase mb-2">History</p>
        <h1 className="text-[22px] font-medium text-text mb-1">Analysis history</h1>
        <p className="text-[14px] text-text-muted">Browse past analyses. Click two rows to compare them.</p>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="flex flex-1 border border-border-2 rounded-lg overflow-hidden bg-bg-surface focus-within:border-accent transition-colors">
          <span className="flex items-center px-3 bg-bg-surface2 border-r border-border font-mono text-[12px] text-text-dim whitespace-nowrap">
            <GitBranch className="h-3.5 w-3.5 mr-1.5" />
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
      </div>

      <div className={canDiff ? 'grid grid-cols-[1fr_340px] gap-5' : 'block'}>
        <div>
          {repoUrl
            ? <HistoryList repoUrl={repoUrl} onSelectForDiff={handleSelectForDiff} selected={selected} />
            : (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <GitBranch className="h-8 w-8 text-text-dim" />
                <p className="text-[14px] text-text-muted">Enter a repository URL above to load its analysis history.</p>
              </div>
            )
          }
        </div>

        {canDiff && selected[0] && selected[1] && (
          <div className="bg-bg-surface border border-border rounded-xl p-4">
            <p className="font-mono text-[11px] text-text-dim uppercase tracking-[0.08em] mb-4">Comparing</p>
            <DiffView fromId={selected[0].id} toId={selected[1].id} />
          </div>
        )}
      </div>
    </div>
  )
}
