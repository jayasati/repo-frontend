import type { Metadata } from 'next'
import { Suspense }      from 'react'
import { Spinner }       from '@/components/ui/spinner'
import LoginForm         from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign in — Repo Analyzer',
}

/**
 * Login page — Server Component shell.
 *
 * We wrap LoginForm in Suspense because it uses useSearchParams()
 * (to read the `callbackUrl` query param), which requires a Suspense
 * boundary when the page is statically rendered.
 *
 * See: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
