'use client'

import { useState }           from 'react'
import { Link2, Github }      from 'lucide-react'
import { cn }                 from '@/lib/utils/cn'
import { UrlScanner }         from './UrlScanner'
import { GitHubRepoSelector } from './GitHubRepoSelector'

type Tab = 'url' | 'github'

/**
 * ScanTabs — top-level tab switcher for the /analyze page.
 * Composes the two scan modes without controlling their internal state.
 */
export function ScanTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('url')

  return (
    <div className="space-y-5">
      {/* Tab row */}
      <div className="flex border border-border-2 rounded-lg overflow-hidden w-fit">
        {([
          { key: 'url',    label: 'Public URL scan',  Icon: Link2  },
          { key: 'github', label: 'My GitHub repos',  Icon: Github },
        ] as const).map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 font-mono text-[12px] tracking-[0.04em] transition-colors',
              activeTab === key
                ? 'bg-accent text-black font-medium'
                : 'bg-bg-surface text-text-muted hover:bg-bg-surface2',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Panel */}
      {activeTab === 'url'
        ? <UrlScanner />
        : <GitHubRepoSelector />
      }
    </div>
  )
}
