'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const WEBHOOK_URL = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/webhooks/github`

export function WebhookSettings() {
  const [copied, setCopied] = useState(false)
  const [secret, setSecret] = useState('')

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      {/* Setup steps */}
      <ol className="space-y-3">
        {[
          'Go to your GitHub repo → Settings → Webhooks → Add webhook',
          'Set Content type to: application/json',
          'Set the Payload URL to the value below',
          'Set the Secret to match your GITHUB_WEBHOOK_SECRET env var',
          'Select event: Just the push event',
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-bg-surface2 border border-border flex items-center justify-center font-mono text-[10px] text-text-dim flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="font-sans text-[13px] text-text-muted">{step}</span>
          </li>
        ))}
      </ol>

      {/* Payload URL */}
      <div>
        <p className="font-mono text-[11px] text-text-dim uppercase tracking-[0.08em] mb-2">Payload URL</p>
        <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-lg px-3 py-2.5">
          <code className="flex-1 font-mono text-[12px] text-text break-all">{WEBHOOK_URL}</code>
          <button
            onClick={() => void handleCopy(WEBHOOK_URL)}
            className="flex items-center gap-1 font-mono text-[10px] text-text-dim hover:text-accent transition-colors flex-shrink-0"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'copied' : 'copy'}
          </button>
        </div>
      </div>

      {/* Webhook secret note */}
      <div>
        <p className="font-mono text-[11px] text-text-dim uppercase tracking-[0.08em] mb-2">
          Secret (set in your .env)
        </p>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Paste your GITHUB_WEBHOOK_SECRET to verify it matches"
          className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2.5 font-mono text-[12px] text-text placeholder:text-text-dim outline-none focus:border-accent caret-accent"
        />
        <p className="font-mono text-[10px] text-text-dim mt-1.5">
          This is only checked locally — nothing is sent to any server.
        </p>
      </div>

      {/* What happens */}
      <div className="p-3 bg-bg-surface2 rounded-lg border border-border">
        <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-2">What happens on push</p>
        <p className="text-[12px] text-text-muted leading-relaxed">
          Every push to the default branch triggers an automatic analysis.
          Only the default branch is analyzed — feature branch pushes are ignored.
          The signature is verified with HMAC-SHA256 before any action is taken.
        </p>
      </div>
    </div>
  )
}