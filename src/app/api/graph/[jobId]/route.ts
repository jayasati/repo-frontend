import { NextRequest, NextResponse } from 'next/server'
import { apiFetch, ApiError } from '@/lib/api/client'

/** Proxy all /api/graph/:jobId/* requests to the backend. No auth required for graph queries. */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params
  const search = req.nextUrl.searchParams.toString()
  const path = `/graph/${jobId}${search ? `?${search}` : ''}`

  try {
    const data = await apiFetch(path, { method: 'GET' })
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
