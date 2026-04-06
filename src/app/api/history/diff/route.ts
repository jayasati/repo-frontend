import { NextRequest, NextResponse } from 'next/server'
import { auth }       from '@/auth'
import { getDiff }    from '@/lib/api/history.api'
import { ApiError }   from '@/lib/api/client'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const from = req.nextUrl.searchParams.get('from')
  const to   = req.nextUrl.searchParams.get('to')

  if (!from || !to) {
    return NextResponse.json({ message: 'from and to query params are required' }, { status: 400 })
  }

  try {
    const diff = await getDiff(from, to, session.accessToken)
    return NextResponse.json(diff)
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
