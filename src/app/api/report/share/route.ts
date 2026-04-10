import { NextRequest, NextResponse } from 'next/server'
import { auth }       from '@/auth'
import { apiFetch }   from '@/lib/api/client'
import { ApiError }   from '@/lib/api/client'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = await apiFetch('/report/share', {
      method: 'POST',
      accessToken: session.accessToken,
      body,
    })
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
