import type { GitHubRepo } from '@/types/analysis.types'

/** Nest `GET /auth/github/repos` row shape */
export interface NestGithubRepoRow {
  name:          string
  fullName:      string
  isPrivate:     boolean
  defaultBranch: string
}

function stableNumericId(fullName: string): number {
  let h = 0
  for (let i = 0; i < fullName.length; i += 1) {
    h = (Math.imul(31, h) + fullName.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function mapNestGithubRepoToUi(r: NestGithubRepoRow): GitHubRepo {
  return {
    id:               stableNumericId(r.fullName),
    name:             r.name,
    full_name:        r.fullName,
    private:          r.isPrivate,
    html_url:         `https://github.com/${r.fullName}`,
    description:      null,
    language:         null,
    default_branch:   r.defaultBranch,
    updated_at:       new Date().toISOString(),
    stargazers_count: 0,
  }
}
