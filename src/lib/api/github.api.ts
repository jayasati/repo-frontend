import type { GitHubRepo } from '@/types/analysis.types'

/**
 * Fetches the authenticated user's GitHub repositories.
 * Uses the GitHub OAuth access token captured during GitHub sign-in.
 *
 * Called from the Next.js API route (server-side) which gets the token
 * from the NextAuth session — never exposed to the browser.
 */
export async function fetchGitHubRepos(
  githubAccessToken: string,
  page    = 1,
  perPage = 50,
): Promise<GitHubRepo[]> {
  const url = new URL('https://api.github.com/user/repos')
  url.searchParams.set('sort',      'updated')
  url.searchParams.set('direction', 'desc')
  url.searchParams.set('per_page',  String(perPage))
  url.searchParams.set('page',      String(page))
  url.searchParams.set('visibility','all')

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${githubAccessToken}`,
      Accept:        'application/vnd.github.v3+json',
    },
    next: { revalidate: 60 },   // cache for 60s on the server
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.json() as Promise<GitHubRepo[]>
}

/**
 * Fetches branches for a specific GitHub repository.
 */
export async function fetchRepoBranches(
  owner:             string,
  repo:              string,
  githubAccessToken: string,
): Promise<{ name: string }[]> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches?per_page=30`,
    {
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
        Accept:        'application/vnd.github.v3+json',
      },
    },
  )

  if (!response.ok) return []
  return response.json() as Promise<{ name: string }[]>
}
