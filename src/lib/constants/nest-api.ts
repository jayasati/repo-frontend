/**
 * Public Nest API base URL (browser-safe).
 * GitHub OAuth must hit the backend directly so tokens are stored in the DB.
 */
export function nestPublicBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}

export function nestGithubOAuthStartUrl(): string {
  return `${nestPublicBaseUrl()}/auth/github`
}
