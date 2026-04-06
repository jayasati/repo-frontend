import type { ReactNode } from 'react'
import { auth }           from '@/auth'
import { redirect }       from 'next/navigation'
import Sidebar            from './components/Sidebar'
import Topbar             from './components/Topbar'

/**
 * Dashboard layout — Server Component.
 *
 * Reads the session on the server and redirects if unauthenticated.
 * (The middleware already handles this, but double-checking here
 *  prevents accidental server-side rendering of protected content.)
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Topbar user={session.user} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
