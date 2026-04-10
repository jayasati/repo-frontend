import { NextRequest, NextResponse } from 'next/server'
import { auth }                     from '@/auth'
import { getAggregatedTrend }       from '@/lib/api/history.api'
import { ApiError }                 from '@/lib/api/client'
import type { BucketSize }          from '@/types/history.types'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const repoUrl = req.nextUrl.searchParams.get('repoUrl')
  if (!repoUrl) {
    return NextResponse.json({ message: 'repoUrl query param is required' }, { status: 400 })
  }

  const bucket = (req.nextUrl.searchParams.get('bucket') ?? 'weekly') as BucketSize
  const limit  = Number(req.nextUrl.searchParams.get('limit') ?? '100')

  try {
    const data = await getAggregatedTrend(repoUrl, bucket, limit, session.accessToken)
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
