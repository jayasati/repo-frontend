'use client'

import { useState, useEffect }  from 'react'
import { useRouter }             from 'next/navigation'
import { nestGithubOAuthStartUrl } from '@/lib/constants/nest-api'
import { Github, RefreshCw, Search } from 'lucide-react'
import { toast }                  from 'sonner'
import { cn }                     from '@/lib/utils/cn'
import { Button }                 from '@/components/ui/button'
import { Spinner }                from '@/components/ui/spinner'
import { useGitHubRepos }         from '@/hooks/useGitHubRepos'
import { useAnalysisStore }       from '@/features/analysis/store/analysis.store'
import type { GitHubRepo }        from '@/types/analysis.types'

/**
 * GitHubRepoSelector — renders when the user has connected their GitHub account.
 *
 * Shows a searchable repo list + branch/subdir picker + analyse button.
 * Falls back to a "Connect GitHub" prompt when the user signed in with credentials.
 *
 * GitHub OAuth runs on Nest so the access token is stored in the DB (encrypted).
 * After redirect, `/auth/github-complete` bootstraps the NextAuth session.
 */
export function GitHubRepoSelector() {
  const router          = useRouter()
  const setCurrentJobId = useAnalysisStore((s) => s.setCurrentJobId)

  const { repos, isLoading, error, isConnected, refetch } = useGitHubRepos()

  const [query,          setQuery]          = useState('')
  const [selected,       setSelected]       = useState<GitHubRepo | null>(null)
  const [branch,         setBranch]         = useState('main')
  const [branches,       setBranches]       = useState<string[]>([])
  const [subdir,         setSubdir]         = useState('')
  const [isSubmitting,   setIsSubmitting]   = useState(false)
  const [branchLoading,  setBranchLoading]  = useState(false)
  const [isConnecting,   setIsConnecting]   = useState(false)

  // When user selects a repo, fetch its branches and pre-select the default branch
  useEffect(() => {
    if (!selected) return
    setBranch(selected.default_branch)
    setBranches([])

    const load = async () => {
      setBranchLoading(true)
      try {
        const [owner, repo] = selected.full_name.split('/')
        const res = await fetch(`/api/github/repos/${owner}/${repo}/branches`)
        if (res.ok) {
          const data = await res.json() as { name: string }[]
          setBranches(data.map((b) => b.name))
        }
      } catch {
        // fall back silently — branch select will show default only
      } finally {
        setBranchLoading(false)
      }
    }

    void load()
  }, [selected])

  const handleAnalyze = async () => {
    if (!selected) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/analyze', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          source: selected.html_url,
          branch,
          subdir: subdir.trim() || undefined,
        }),
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

  // ── Connect GitHub prompt ──────────────────────────────────────────────────
  const handleConnectGitHub = () => {
    setIsConnecting(true)
    window.location.assign(nestGithubOAuthStartUrl())
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center text-center py-10 px-6 bg-bg-surface border border-border rounded-xl gap-4">
        <div className="w-12 h-12 rounded-full bg-bg-surface2 flex items-center justify-center">
          <Github className="h-6 w-6 text-text-muted" />
        </div>
        <div>
          <p className="text-[15px] font-medium text-text mb-1">Connect your GitHub account</p>
          <p className="text-[13px] text-text-muted max-w-xs">
            Sign in with GitHub to browse your private repositories and analyze them directly.
          </p>
        </div>

        <Button
          variant="github"
          size="md"
          loading={isConnecting}
          onClick={() => void handleConnectGitHub()}
          className="gap-2"
        >
          <Github className="h-4 w-4" />
          Continue with GitHub
        </Button>

        <p className="text-[11px] text-text-dim">
          Read-only access. Nothing is cloned without your explicit selection.
        </p>
      </div>
    )
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3 text-text-muted">
        <Spinner size="md" />
        <span className="font-mono text-[13px]">Loading your repositories…</span>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-4 bg-ra-red-dim border border-ra-red/40 rounded-lg text-ra-red font-mono text-[13px] flex items-center justify-between">
        <span>{error}</span>
        <Button variant="ghost" size="sm" onClick={refetch}>Retry</Button>
      </div>
    )
  }

  const filtered = repos.filter((r) =>
    r.full_name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="grid grid-cols-[1fr_280px] gap-4">
      {/* ── Left: repo list ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        {/* Search + refresh */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-dim pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search repositories…"
              className="w-full bg-bg-surface2 border border-border rounded-lg pl-8 pr-3 py-2 font-mono text-[12px] text-text placeholder:text-text-dim outline-none focus:border-border-2 caret-accent"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={refetch} aria-label="Refresh">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Repo list */}
        <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <p className="font-mono text-[12px] text-text-dim px-2 py-4 text-center">
              No repositories found
            </p>
          ) : (
            filtered.map((repo) => (
              <button
                key={repo.id}
                type="button"
                onClick={() => setSelected(repo)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors',
                  selected?.id === repo.id
                    ? 'border-accent bg-accent/5'
                    : 'border-border bg-bg hover:border-border-2 hover:bg-bg-surface',
                )}
              >
                <div
                  className={cn(
                    'w-3.5 h-3.5 rounded-full border-[1.5px] flex-shrink-0 transition-colors',
                    selected?.id === repo.id
                      ? 'border-accent bg-accent'
                      : 'border-text-dim',
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[13px] text-text truncate">{repo.full_name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {repo.language && (
                      <span className="font-mono text-[10px] text-text-dim">{repo.language}</span>
                    )}
                    {repo.private && (
                      <span className="font-mono text-[10px] text-text-dim">private</span>
                    )}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-text-dim flex-shrink-0">
                  {repo.default_branch}
                </span>
              </button>
            ))
          )}
        </div>

        <p className="font-mono text-[10px] text-text-dim text-right">
          {filtered.length} of {repos.length} repositories
        </p>
      </div>

      {/* ── Right: config card ───────────────────────────────────────────── */}
      <div>
        {!selected ? (
          <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl">
            <p className="font-mono text-[12px] text-text-dim text-center px-4">
              Select a repository to configure the scan
            </p>
          </div>
        ) : (
          <div className="bg-bg border border-accent rounded-xl p-4 space-y-4">
            <div>
              <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-1">repository</p>
              <p className="font-mono text-[13px] text-text break-all">{selected.full_name}</p>
            </div>

            {/* Branch picker */}
            <div>
              <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-1">branch</p>
              {branchLoading ? (
                <div className="flex items-center gap-2 text-text-dim">
                  <Spinner size="sm" />
                  <span className="font-mono text-[12px]">Loading…</span>
                </div>
              ) : (
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-bg-surface2 border border-border rounded-md px-2.5 py-1.5 font-mono text-[12px] text-text outline-none focus:border-border-2 cursor-pointer"
                >
                  {(branches.length ? branches : [selected.default_branch]).map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Subdirectory */}
            <div>
              <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-1">
                subdirectory <span className="normal-case">(optional)</span>
              </p>
              <input
                type="text"
                value={subdir}
                onChange={(e) => setSubdir(e.target.value)}
                placeholder="e.g. src/backend"
                className="w-full bg-bg-surface2 border border-border rounded-md px-2.5 py-1.5 font-mono text-[12px] text-text placeholder:text-text-dim outline-none focus:border-border-2 caret-accent"
              />
            </div>

            <Button
              variant="accent"
              size="full"
              loading={isSubmitting}
              onClick={() => void handleAnalyze()}
              className="font-mono text-[12px]"
            >
              ANALYZE REPO →
            </Button>

            <p className="font-mono text-[10px] text-text-dim text-center">
              {new Date(selected.updated_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })} · last pushed
            </p>
          </div>
        )}
      </div>
    </div>
  )
}