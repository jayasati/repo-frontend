import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/auth'

/**
 * Nest GitHub OAuth completes with a Nest JWT. This route runs server-side
 * `signIn('credentials', { nestJwt })` so session cookies are set reliably
 * (client-side signIn after an external redirect often fails or drops cookies).
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('access_token')
  if (!token?.trim()) {
    return NextResponse.redirect(new URL('/login?error=MissingNestToken', req.url))
  }

  try {
    await signIn('credentials', {
      nestJwt:    token.trim(),
      redirect:   false,
      redirectTo: '/dashboard',
    })
  } catch (err) {
    console.error('[nest-github-callback]', err)
    return NextResponse.redirect(new URL('/login?error=GithubSession', req.url))
  }

  return NextResponse.redirect(new URL('/dashboard', req.url))
}
