'use client'

import Link              from 'next/link'
import { usePathname }   from 'next/navigation'
import {
  LayoutDashboard,
  Search,
  History,
  GitBranch,
  TrendingUp,
  MessageSquare,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/analyze',      label: 'Analyze',      icon: Search          },
  { href: '/repositories', label: 'Repositories', icon: GitBranch       },
  { href: '/history',      label: 'History',      icon: History         },
  { href: '/trends',       label: 'Trends',       icon: TrendingUp      },
  { href: '/chat',         label: 'Chat',         icon: MessageSquare   },
] as const

const BOTTOM_ITEMS = [
  { href: '/settings', label: 'Settings', icon: Settings },
] as const

/**
 * Sidebar — 'use client' because usePathname needs the browser router.
 * Kept simple and stateless — no collapsed state in Phase 1.
 */
export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(href)

  return (
    <aside className="w-48 flex-shrink-0 border-r border-border bg-bg flex flex-col py-3 overflow-y-auto">
      {/* Main nav */}
      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors',
              isActive(href)
                ? 'bg-bg-surface2 text-text'
                : 'text-text-muted hover:bg-bg-surface hover:text-text',
            )}
          >
            <Icon
              className={cn(
                'h-[14px] w-[14px] flex-shrink-0',
                isActive(href) ? 'text-accent' : 'text-text-dim',
              )}
            />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-2 pt-2 border-t border-border space-y-0.5">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors',
              isActive(href)
                ? 'bg-bg-surface2 text-text'
                : 'text-text-muted hover:bg-bg-surface hover:text-text',
            )}
          >
            <Icon className="h-[14px] w-[14px] flex-shrink-0 text-text-dim" />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  )
}
