'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function BadgePreview() {
  const [owner,  setOwner]  = useState('')
  const [repo,   setRepo]   = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
  const badgeUrl   = owner && repo ? `${baseUrl}/badge/${owner}/${repo}` : null
  const markdownMd = badgeUrl ? `![Architecture Score](${badgeUrl})` : ''
  const htmlEmbed  = badgeUrl ? `<img src="${badgeUrl}" alt="Architecture Score" />` : ''

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-5">
      {/* Repo input */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-1.5">Owner</p>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="e.g. nestjs"
            className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2 font-mono text-[12px] text-text placeholder:text-text-dim outline-none focus:border-accent caret-accent"
          />
        </div>
        <div>
          <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-1.5">Repository</p>
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="e.g. nest"
            className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2 font-mono text-[12px] text-text placeholder:text-text-dim outline-none focus:border-accent caret-accent"
          />
        </div>
      </div>

      {/* Badge preview */}
      {badgeUrl && (
        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-3">
          <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em]">Preview</p>
          {/* Simulated badge — the real one comes from the NestJS SVG endpoint */}
          <div className="flex items-center gap-0 text-white text-[11px] font-sans w-fit rounded overflow-hidden">
            <span className="bg-[#555] px-2.5 py-1">architecture</span>
            <span className="bg-[#22c55e] px-2.5 py-1">score/100</span>
          </div>
          <p className="font-mono text-[10px] text-text-dim">
            The actual score will appear once this repo has been analyzed.
          </p>
        </div>
      )}

      {/* Embed snippets */}
      {badgeUrl && (
        <div className="space-y-3">
          {[
            { label: 'Markdown (README.md)', value: markdownMd, key: 'md' },
            { label: 'HTML', value: htmlEmbed, key: 'html' },
          ].map(({ label, value, key }) => (
            <div key={key}>
              <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em] mb-1.5">{label}</p>
              <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-lg px-3 py-2">
                <code className="flex-1 font-mono text-[11px] text-text-muted break-all">{value}</code>
                <button
                  onClick={() => void handleCopy(value, key)}
                  className="flex items-center gap-1 font-mono text-[10px] text-text-dim hover:text-accent transition-colors flex-shrink-0"
                >
                  {copied === key
                    ? <Check className="h-3.5 w-3.5 text-accent" />
                    : <Copy className="h-3.5 w-3.5" />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!badgeUrl && (
        <p className="font-mono text-[12px] text-text-dim">
          Enter an owner and repository name above to generate your badge embed code.
        </p>
      )}
    </div>
  )
}