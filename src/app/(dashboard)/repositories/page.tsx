'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GitBranch, ExternalLink, Search } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { useGitHubRepos } from '@/hooks/useGitHubRepos'
import type { GitHubRepo } from '@/types/analysis.types'
import { nestGithubOAuthStartUrl } from '@/lib/constants/nest-api'
import { setLastAnalyzedRepo } from '@/lib/last-analyzed-repo'

export default function RepositoriesPage() {
  const router = useRouter()
  const { repos, isLoading, error, isConnected } = useGitHubRepos()
  const [query, setQuery] = useState('')

  const filtered = repos.filter((r) =>
    r.full_name.toLowerCase().includes(query.toLowerCase()) ||
    (r.description ?? '').toLowerCase().includes(query.toLowerCase())
  )

  const handleAnalyze = async (repo: GitHubRepo) => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: repo.html_url }),
    })

    if (!res.ok) return

    const { jobId } = (await res.json()) as { jobId: string }
    setLastAnalyzedRepo(repo.html_url)
    router.push(`/analyze/${jobId}`)
  }

  return (
    <div className="p-6 max-w-4xl animate-fade-in">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-accent tracking-[0.1em] uppercase mb-2">
          Repositories
        </p>
        <h1 className="text-[22px] font-medium text-text mb-1">
          Your repositories
        </h1>
        <p className="text-[14px] text-text-muted">
          {isConnected
            ? 'Your connected GitHub repositories. Click Analyze to scan any of them.'
            : 'Connect your GitHub account to browse your repositories here.'}
        </p>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center py-16 gap-4 text-center">
          <GitBranch className="h-10 w-10 text-text-dim" />
          <p className="text-[14px] text-text-muted">
            Sign in with GitHub to see your repositories.
          </p>

          <a
            href={nestGithubOAuthStartUrl()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-[13px] font-medium transition-colors"
          >
            <GitBranch className="h-4 w-4" />
            Connect GitHub
          </a>
        </div>
      ) : isLoading ? (
        <div className="flex items-center gap-2 py-12 text-text-muted">
          <Spinner size="md" />
          <span className="font-mono text-[13px]">
            Loading repositories…
          </span>
        </div>
      ) : error ? (
        <div className="p-4 bg-ra-red-dim border border-ra-red/30 rounded-lg font-mono text-[13px] text-ra-red">
          {error}
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-dim pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search repositories…"
              className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 font-mono text-[12px] text-text placeholder:text-text-dim outline-none focus:border-accent caret-accent"
            />
          </div>

          {/* Repo grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((repo) => (
              <div
                key={repo.id}
                className="flex flex-col gap-3 p-4 bg-bg-surface border border-border rounded-xl hover:border-border-2 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-mono text-[13px] text-text truncate">
                        {repo.full_name}
                      </p>
                      {repo.private && (
                        <span className="px-1.5 py-0.5 rounded bg-bg-surface2 border border-border font-mono text-[10px] text-text-dim flex-shrink-0">
                          private
                        </span>
                      )}
                    </div>

                    {repo.description && (
                      <p className="text-[12px] text-text-muted line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                  </div>

                  {/* ✅ FIXED */}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-dim hover:text-text transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <span className="font-mono text-[11px] text-text-dim">
                        {repo.language}
                      </span>
                    )}
                    <span className="font-mono text-[11px] text-text-dim">
                      {repo.default_branch}
                    </span>
                    <span className="font-mono text-[11px] text-text-dim">
                      {new Date(repo.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <button
                    onClick={() => void handleAnalyze(repo)}
                    className="px-3 py-1.5 bg-accent text-black rounded-md font-mono text-[11px] font-medium hover:bg-accent/90 transition-colors"
                  >
                    Analyze →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="font-mono text-[11px] text-text-dim text-right mt-3">
            {filtered.length} of {repos.length} repositories
          </p>
        </>
      )}
    </div>
  )
}