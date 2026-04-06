'use client'

import { useState }          from 'react'
import { Key, Webhook, Shield } from 'lucide-react'
import { cn }                from '@/lib/utils/cn'
import { ApiKeyManager }     from '@/components/settings/ApiKeyManager'
import { WebhookSettings }   from '@/components/settings/WebhookSettings'
import { BadgePreview }      from '@/components/settings/BadgePreview'

type Tab = 'api-keys' | 'webhooks' | 'badge'

const TABS: { key: Tab; label: string; Icon: React.ElementType }[] = [
  { key: 'api-keys',  label: 'API keys',  Icon: Key     },
  { key: 'webhooks',  label: 'Webhooks',  Icon: Webhook  },
  { key: 'badge',     label: 'Badge',     Icon: Shield   },
]

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('api-keys')

  const titles: Record<Tab, { heading: string; sub: string }> = {
    'api-keys': {
      heading: 'API keys',
      sub:     'Generate keys to authenticate against the Repo Analyzer REST API.',
    },
    'webhooks': {
      heading: 'GitHub webhooks',
      sub:     'Auto-analyze on every push to the default branch.',
    },
    'badge': {
      heading: 'Score badge',
      sub:     'Embed a live architecture score badge in your README.',
    },
  }

  return (
    <div className="p-6 max-w-3xl animate-fade-in">
      <div className="mb-6">
        <p className="font-mono text-[11px] text-accent tracking-[0.1em] uppercase mb-2">Settings</p>
        <h1 className="text-[22px] font-medium text-text mb-1">{titles[tab].heading}</h1>
        <p className="text-[14px] text-text-muted">{titles[tab].sub}</p>
      </div>

      {/* Tab row */}
      <div className="flex gap-1 mb-6 border-b border-border pb-0">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 font-mono text-[12px] border-b-2 -mb-px transition-colors',
              tab === key
                ? 'border-accent text-text'
                : 'border-transparent text-text-muted hover:text-text',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-bg-surface border border-border rounded-xl p-5">
        {tab === 'api-keys' && <ApiKeyManager />}
        {tab === 'webhooks' && <WebhookSettings />}
        {tab === 'badge'    && <BadgePreview />}
      </div>
    </div>
  )
}