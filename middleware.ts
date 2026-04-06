import { auth } from '@/auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Route protection middleware.
 *
 * Rules:
 * - Public routes (auth pages): accessible only when NOT logged in.
 *   If already logged in, redirect to /dashboard.
 * - Protected routes (everything else under /): require a valid session.
 *   If not logged in, redirect to /login with a `callbackUrl` param.
 * - /api/auth/* routes are always public (NextAuth internals).
 * - Static assets and Next.js internals are skipped via `matcher`.
 */

const PUBLIC_ROUTES  = ['/login', '/register', '/auth/github-complete']
const API_AUTH_PREFIX = '/api/auth'

export default auth(function middleware(req: NextRequest & { auth: unknown }) {
  const { nextUrl } = req
  const isLoggedIn  = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX)
  const isPublicRoute  = PUBLIC_ROUTES.includes(nextUrl.pathname)

  // Always allow NextAuth's own API routes through
  if (isApiAuthRoute) return NextResponse.next()

  // Already logged in → redirect away from auth pages to dashboard
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  // Not logged in → redirect to login with the original URL as callback
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  /**
   * Match all routes EXCEPT:
   * - Next.js internals (_next/static, _next/image)
   * - Favicon and other root static files
   * - The /backend rewrite proxy prefix
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|backend|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
