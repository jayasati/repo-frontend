import { NextRequest, NextResponse } from 'next/server'
import { auth }       from '@/auth'
import { apiFetch }   from '@/lib/api/client'
import { ApiError }   from '@/lib/api/client'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const repoUrl = req.nextUrl.searchParams.get('repoUrl')
  if (!repoUrl) {
    return NextResponse.json({ message: 'repoUrl required' }, { status: 400 })
  }

  try {
    const params = new URLSearchParams({ repoUrl })
    const data = await apiFetch(`/history/target?${params}`, {
      method: 'GET',
      accessToken: session.accessToken,
    })
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = await apiFetch('/history/target', {
      method: 'PUT',
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
