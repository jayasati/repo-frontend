'use client'

import { useCallback, useEffect, useState } from 'react'
import type { GitHubRepo }                   from '@/types/analysis.types'

interface UseGitHubReposResult {
  repos:       GitHubRepo[]
  isLoading:   boolean
  error:       string | null
  isConnected: boolean   // false when the user hasn't connected GitHub OAuth
  refetch:     () => void
}

/**
 * Fetches the authenticated user's GitHub repos from our proxy API route.
 *
 * `isConnected` will be false when the user logged in with credentials instead
 * of GitHub OAuth — the parent component should show a "Connect GitHub" CTA.
 */
export function useGitHubRepos(): UseGitHubReposResult {
  const [repos,       setRepos]       = useState<GitHubRepo[]>([])
  const [isLoading,   setIsLoading]   = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(true)

  const fetchRepos = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/github/repos')

      if (res.status === 403 || res.status === 401) {
        setIsConnected(false)
        setRepos([])
        return
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(body.message ?? `HTTP ${res.status}`)
      }

      const data = await res.json() as GitHubRepo[]
      setIsConnected(true)
      setRepos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load repositories')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchRepos() }, [fetchRepos])

  return { repos, isLoading, error, isConnected, refetch: fetchRepos }
}
