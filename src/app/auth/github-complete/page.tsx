'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

/**
 * Nest may redirect here with ?access_token= (legacy) or you can point
 * GITHUB_OAUTH_SUCCESS_URL at /api/auth/nest-github-callback directly.
 * This page forwards to the API route so cookies are set on the server.
 */
function GithubCompleteInner() {
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('Completing sign-in…')

  useEffect(() => {
    const token = searchParams.get('access_token')
    if (!token) {
      setMessage('Missing token. Use Connect GitHub from the app, or check GITHUB_OAUTH_SUCCESS_URL on the API.')
      return
    }
    const next = `/api/auth/nest-github-callback?access_token=${encodeURIComponent(token)}`
    window.location.replace(next)
  }, [searchParams])

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 p-8">
      <Spinner size="md" />
      <p className="font-mono text-[13px] text-text-muted text-center max-w-md">{message}</p>
    </div>
  )
}

export default function GithubCompletePage() {
  return (
    <Suspense
      fallback={(
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="md" />
        </div>
      )}
    >
      <GithubCompleteInner />
    </Suspense>
  )
}
