import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { apiFetch, ApiError } from '@/lib/api/client'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { owner, repo } = await params

  try {
    const branches = await apiFetch<{ name: string }[]>(
      `/auth/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`,
      { method: 'GET', accessToken: session.accessToken },
    )
    return NextResponse.json(branches)
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      return NextResponse.json([], { status: 200 })
    }
    return NextResponse.json([], { status: 200 })
  }
}
