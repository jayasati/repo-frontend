import { NextRequest, NextResponse } from 'next/server'
import { auth }          from '@/auth'
import { getHistory }    from '@/lib/api/history.api'
import { ApiError }      from '@/lib/api/client'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const repoUrl = req.nextUrl.searchParams.get('repoUrl')
  if (!repoUrl) {
    return NextResponse.json({ message: 'repoUrl query param is required' }, { status: 400 })
  }

  const limit  = Number(req.nextUrl.searchParams.get('limit') ?? '20')
  const cursor = req.nextUrl.searchParams.get('cursor') ?? undefined

  try {
    const result = await getHistory(repoUrl, limit, session.accessToken, cursor)
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
