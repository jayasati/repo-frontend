import { NextRequest, NextResponse } from 'next/server'
import { apiFetch, ApiError } from '@/lib/api/client'

/** Catch-all proxy for /api/graph/:jobId/dependencies, /dependents, /path, /impact, /modules */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string; path: string[] }> },
) {
  const { jobId, path: segments } = await params
  const subPath = segments.join('/')
  const search = req.nextUrl.searchParams.toString()
  const fullPath = `/graph/${jobId}/${subPath}${search ? `?${search}` : ''}`

  try {
    const data = await apiFetch(fullPath, { method: 'GET' })
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
