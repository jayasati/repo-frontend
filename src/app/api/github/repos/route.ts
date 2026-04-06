import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { apiFetch, ApiError } from '@/lib/api/client'
import {
  mapNestGithubRepoToUi,
  type NestGithubRepoRow,
} from '@/lib/github/nest-github-repo'

/**
 * GET /api/github/repos
 *
 * Lists repos using the GitHub token stored on the Nest user (encrypted in DB).
 * Survives NextAuth sign-out: after login, Nest JWT loads the same link again.
 */
export async function GET(_req: NextRequest) {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const rows = await apiFetch<NestGithubRepoRow[]>('/auth/github/repos', {
      method:      'GET',
      accessToken: session.accessToken,
    })
    return NextResponse.json(rows.map(mapNestGithubRepoToUi))
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      const msg = String(err.message ?? '')
      const noGithub =
        err.status === 403 ||
        (err.status === 404 &&
          /no github account linked|github account not linked|not linked for this user/i.test(msg))
      if (noGithub) {
        return NextResponse.json(
          { message: 'GitHub not connected. Use Connect GitHub in the app.' },
          { status: 403 },
        )
      }
    }
    console.error('[GET /api/github/repos]', err)
    return NextResponse.json({ message: 'Failed to fetch GitHub repositories' }, { status: 502 })
  }
}
