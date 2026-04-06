import { signOut } from '@/auth'
import { Button }  from '@/components/ui/button'
import { LogOut }  from 'lucide-react'

interface TopbarProps {
  user: {
    id?:    string | null
    email?: string | null
    name?:  string | null
    role?:  string | null
  }
}

/**
 * Topbar — Server Component.
 * Uses a form + Server Action to sign out (works without JS).
 */
export default function Topbar({ user }: TopbarProps) {
  const initials = user.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'JR'

  return (
    <header className="h-12 flex items-center justify-between px-5 border-b border-border bg-bg-surface flex-shrink-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 bg-accent rounded flex items-center justify-center text-[11px] font-mono font-medium text-black">
          RA
        </div>
        <span className="font-mono text-[13px] text-text-muted">repo-analyzer</span>

        {/* Live status dot */}
        <div className="flex items-center gap-1.5 ml-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] text-text-dim">API connected</span>
        </div>
      </div>

      {/* Right: user + signout */}
      <div className="flex items-center gap-3">
        {/* User avatar + email */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-bg-surface2 border border-border flex items-center justify-center text-[11px] font-mono font-medium text-text-muted">
            {initials}
          </div>
          <span className="font-mono text-[12px] text-text-muted hidden sm:block">
            {user.email}
          </span>
        </div>

        {/* Sign out — Server Action form so it works without JS */}
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/login' })
          }}
        >
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </form>
      </div>
    </header>
  )
}
