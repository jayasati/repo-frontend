import { NextRequest } from 'next/server'
import { auth }         from '@/auth'

/**
 * GET /api/analyze/:jobId/progress
 *
 * Proxies the NestJS SSE stream to the browser.
 *
 * WHY proxy instead of connecting directly from the browser:
 * - The browser EventSource API doesn't support custom headers (no Authorization).
 * - We can't use query-param tokens without exposing them in the URL.
 * - This server-side proxy adds the Bearer token invisibly, keeping auth secure.
 *
 * The browser simply connects to this Next.js route via EventSource and
 * receives the same data: {jobId, status, message, progress}
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const session = await auth()

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { jobId } = await params
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/analyze/${jobId}/progress`

  const headers: Record<string, string> = {
    Accept:          'text/event-stream',
    'Cache-Control': 'no-cache',
  }
  if (session.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`
  }

  const backendResponse = await fetch(backendUrl, { headers })

  if (!backendResponse.ok || !backendResponse.body) {
    return new Response('Failed to connect to analysis stream', { status: 502 })
  }

  // Stream the response directly to the client
  return new Response(backendResponse.body, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      // Disable nginx/Vercel buffering
      'X-Accel-Buffering': 'no',
    },
  })
}
