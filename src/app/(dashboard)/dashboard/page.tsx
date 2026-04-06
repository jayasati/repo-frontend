import type { Metadata }    from 'next'
import { auth }             from '@/auth'
import { redirect }         from 'next/navigation'
import Link                 from 'next/link'
import { ArrowRight, Search, History, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — Repo Analyzer',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { user } = session
  const greeting  = getGreeting()

  return (
    <div className="p-6 max-w-5xl animate-fade-in">
      <div className="mb-8">
        <p className="font-mono text-[11px] text-accent tracking-[0.1em] uppercase mb-2">
          {greeting}
        </p>
        <h1 className="text-[22px] font-medium text-text mb-1">
          {user.email?.split('@')[0] ?? 'Welcome back'}
        </h1>
        <p className="text-[14px] text-text-muted">
          Architecture intelligence for your repositories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link href="/analyze"
          className="group flex flex-col gap-3 p-4 bg-bg-surface border border-border rounded-xl hover:border-accent transition-colors">
          <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Search className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-text mb-0.5">Analyze a repo</p>
            <p className="text-[12px] text-text-muted">
              Scan any public GitHub URL or your connected repositories.
            </p>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-accent mt-auto">
            Get started <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <div className="flex flex-col gap-3 p-4 bg-bg-surface border border-border rounded-xl opacity-60">
          <div className="w-9 h-9 rounded-lg bg-bg-surface2 border border-border flex items-center justify-center">
            <History className="h-4 w-4 text-text-muted" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-text mb-0.5">View history</p>
            <p className="text-[12px] text-text-muted">Browse past analyses and compare results.</p>
          </div>
          <p className="font-mono text-[11px] text-text-dim mt-auto">Coming in Phase 3</p>
        </div>

        <div className="flex flex-col gap-3 p-4 bg-bg-surface border border-border rounded-xl opacity-60">
          <div className="w-9 h-9 rounded-lg bg-bg-surface2 border border-border flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-text-muted" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-text mb-0.5">Score trends</p>
            <p className="text-[12px] text-text-muted">Track architecture health over time.</p>
          </div>
          <p className="font-mono text-[11px] text-text-dim mt-auto">Coming in Phase 3</p>
        </div>
      </div>

      <div className="p-4 bg-bg-surface border border-border rounded-xl">
        <p className="font-mono text-[11px] text-text-dim uppercase tracking-[0.08em] mb-3">Active session</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'User ID',  value: (user.id ?? '').slice(0, 8) + '…' },
            { label: 'Email',    value: user.email ?? '—' },
            { label: 'Role',     value: user.role  ?? 'user' },
            { label: 'Strategy', value: 'JWT' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-bg-surface2 rounded-lg px-3 py-2.5">
              <p className="font-mono text-[10px] text-text-dim uppercase mb-1">{label}</p>
              <p className="font-mono text-[12px] text-text truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
