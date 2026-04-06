import { NextRequest, NextResponse } from 'next/server'
import { auth }                       from '@/auth'
import { enqueueAnalysis }            from '@/lib/api/analyze.api'
import { ApiError }                   from '@/lib/api/client'

/**
 * POST /api/analyze
 *
 * Proxies the enqueue request to NestJS. Sends Nest JWT when the user has one
 * (credentials login); GitHub-only sessions still work — Nest /analyze has no JWT guard.
 *
 * Request body: { source: string, branch?: string, subdir?: string }
 * Response:     { jobId: string }  (202 Accepted)
 */
export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const { source, branch, subdir } = body as {
    source?: string
    branch?: string
    subdir?: string
  }

  if (!source || typeof source !== 'string') {
    return NextResponse.json({ message: 'source is required' }, { status: 400 })
  }

  try {
    const result = await enqueueAnalysis(
      { source, branch, subdir },
      session.accessToken || undefined,
    )

    return NextResponse.json(result, { status: 202 })
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      )
    }
    console.error('[POST /api/analyze]', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
