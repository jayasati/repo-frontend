import { NextRequest, NextResponse } from 'next/server'
import { auth }                       from '@/auth'
import { getAnalysisResult }          from '@/lib/api/analyze.api'
import { ApiError }                   from '@/lib/api/client'

/**
 * GET /api/analyze/:jobId
 * Fetches the completed analysis result from the NestJS Redis cache.
 * Returns 404 if the job isn't finished yet.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { jobId } = await params

  try {
    const result = await getAnalysisResult(jobId, session.accessToken || undefined)
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      )
    }
    console.error(`[GET /api/analyze/${jobId}]`, err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
