import { NextRequest, NextResponse } from 'next/server'
import { auth }            from '@/auth'
import { listApiKeys, generateApiKey } from '@/lib/api/settings.api'
import { ApiError }        from '@/lib/api/client'

export async function GET() {
  const session = await auth()
  if (!session?.accessToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const keys = await listApiKeys(session.accessToken)
    return NextResponse.json(keys)
  } catch (err) {
    if (err instanceof ApiError) return NextResponse.json({ message: err.message }, { status: err.status })
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.accessToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({})) as { name?: string }

  try {
    const key = await generateApiKey(session.accessToken, body.name)
    return NextResponse.json(key, { status: 201 })
  } catch (err) {
    if (err instanceof ApiError) return NextResponse.json({ message: err.message }, { status: err.status })
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}