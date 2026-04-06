'use client'

import { useState } from 'react'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

interface DiagramBlockProps {
  title:   string
  content: string
}

/**
 * DiagramBlock — collapsible accordion that shows PlantUML source.
 * Applies lightweight keyword highlighting and a copy-to-clipboard button.
 */
export function DiagramBlock({ title, content }: DiagramBlockProps) {
  const [open,   setOpen]   = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const highlighted = content
    .replace(
      /(@startuml|@enduml)/g,
      '<span class="text-ra-blue">$1</span>',
    )
    .replace(
      /\b(class|component|participant|package|interface|note|as)\b/g,
      '<span class="text-ra-blue">$1</span>',
    )
    .replace(
      /(-->|->|\.\.>|<--)/g,
      '<span class="text-ra-amber">$1</span>',
    )
    .replace(
      /\b([A-Z][A-Za-z0-9]+)\b/g,
      '<span class="text-accent">$1</span>',
    )

  return (
    <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-bg-surface2 transition-colors"
      >
        <span className="font-mono text-[12px] text-text">{title}</span>
        <div className="flex items-center gap-3">
          {open && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); void handleCopy() }}
              className="flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-text transition-colors"
            >
              {copied
                ? <><Check className="h-3 w-3 text-accent" /> copied</>
                : <><Copy className="h-3 w-3" /> copy</>
              }
            </button>
          )}
          {open
            ? <ChevronUp  className="h-3.5 w-3.5 text-text-dim" />
            : <ChevronDown className="h-3.5 w-3.5 text-text-dim" />
          }
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="border-t border-border bg-bg">
          <pre
            className="px-4 py-3 font-mono text-[11.5px] text-text-muted overflow-x-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}
    </div>
  )
}
