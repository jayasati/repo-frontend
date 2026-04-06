'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster }         from 'sonner'
import type { ReactNode }  from 'react'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Root providers wrapper — wraps the entire app.
 * Kept as a single 'use client' boundary so the root layout can remain a
 * Server Component (better for performance and streaming).
 *
 * Add new providers (Zustand, ReactQuery, etc.) here as phases grow.
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        theme="dark"
        toastOptions={{
          style: {
            background:   '#111113',
            border:       '1px solid #27272A',
            color:        '#FAFAFA',
            fontFamily:   'IBM Plex Sans, sans-serif',
            fontSize:     '13px',
          },
        }}
      />
    </SessionProvider>
  )
}
