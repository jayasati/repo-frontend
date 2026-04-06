import { NextRequest, NextResponse } from 'next/server'
import { auth }                       from '@/auth'
import type { ReportFormat }          from '@/lib/api/analyze.api'

/**
 * GET /api/analyze/:jobId/report?format=markdown|html|json
 * Proxies the NestJS report download endpoint with auth header.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { jobId } = await params
  const format = (req.nextUrl.searchParams.get('format') ?? 'markdown') as ReportFormat

  const validFormats: ReportFormat[] = ['markdown', 'html', 'json']
  if (!validFormats.includes(format)) {
    return NextResponse.json({ message: 'Invalid format' }, { status: 400 })
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/analyze/${jobId}/report?format=${format}`

  const headers: Record<string, string> = {}
  if (session.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`
  }

  const backendResponse = await fetch(backendUrl, { headers })

  if (!backendResponse.ok) {
    return NextResponse.json({ message: 'Report not found' }, { status: backendResponse.status })
  }

  // Forward the response with its Content-Disposition header so the browser
  // triggers a file download automatically
  const contentType        = backendResponse.headers.get('Content-Type')        ?? 'text/plain'
  const contentDisposition = backendResponse.headers.get('Content-Disposition') ?? ''

  return new Response(backendResponse.body, {
    headers: {
      'Content-Type':        contentType,
      'Content-Disposition': contentDisposition,
    },
  })
}
