import { NextRequest, NextResponse } from 'next/server'
import { auth }          from '@/auth'
import { revokeApiKey }  from '@/lib/api/settings.api'
import { ApiError }      from '@/lib/api/client'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.accessToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    await revokeApiKey(id, session.accessToken)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof ApiError) return NextResponse.json({ message: err.message }, { status: err.status })
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}