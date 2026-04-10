'use client'

import { useState } from 'react'
import { Copy, Check, ChevronDown, ChevronUp, Image, Code, Download } from 'lucide-react'
import { plantUmlSvgUrl, plantUmlPngUrl } from '@/lib/plantuml-encode'

interface DiagramBlockProps {
  title:   string
  content: string
}

type ViewMode = 'code' | 'image'

/**
 * DiagramBlock — collapsible accordion that shows PlantUML source
 * and a rendered image preview (via the public PlantUML server).
 * Includes copy-to-clipboard and PNG/SVG download buttons.
 */
export function DiagramBlock({ title, content }: DiagramBlockProps) {
  const [open,   setOpen]   = useState(false)
  const [copied, setCopied] = useState(false)
  const [view,   setView]   = useState<ViewMode>('image')
  const [imgError, setImgError] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async (format: 'png' | 'svg') => {
    const url = format === 'svg' ? plantUmlSvgUrl(content) : plantUmlPngUrl(content)
    try {
      const res  = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch diagram')
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = blobUrl
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${format}`
      a.click()
      URL.revokeObjectURL(blobUrl)
    } catch {
      // Fallback: open in new tab so user can right-click save
      window.open(url, '_blank')
    }
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

  const svgUrl = plantUmlSvgUrl(content)

  return (
    <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-bg-surface2 transition-colors cursor-pointer"
      >
        <span className="font-mono text-[12px] text-text">{title}</span>

        <div className="flex items-center gap-3">
          {open && (
            <>
              {/* View toggle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setView(view === 'code' ? 'image' : 'code')
                }}
                className="flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-text transition-colors"
                title={view === 'code' ? 'Show image' : 'Show code'}
              >
                {view === 'code'
                  ? <><Image className="h-3 w-3" /> image</>
                  : <><Code className="h-3 w-3" /> code</>
                }
              </button>

              {/* Download PNG */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  void handleDownload('png')
                }}
                className="flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-text transition-colors"
                title="Download PNG"
              >
                <Download className="h-3 w-3" /> .png
              </button>

              {/* Download SVG */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  void handleDownload('svg')
                }}
                className="flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-text transition-colors"
                title="Download SVG"
              >
                <Download className="h-3 w-3" /> .svg
              </button>

              {/* Copy code */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  void handleCopy()
                }}
                className="flex items-center gap-1 font-mono text-[11px] text-text-muted hover:text-text transition-colors"
              >
                {copied
                  ? <><Check className="h-3 w-3 text-accent" /> copied</>
                  : <><Copy className="h-3 w-3" /> copy</>
                }
              </button>
            </>
          )}

          {open
            ? <ChevronUp className="h-3.5 w-3.5 text-text-dim" />
            : <ChevronDown className="h-3.5 w-3.5 text-text-dim" />
          }
        </div>
      </div>

      {/* Body */}
      {open && (
        <div className="border-t border-border bg-bg">
          {view === 'image' ? (
            <div className="p-4 flex justify-center overflow-x-auto bg-white rounded-b-lg min-h-[120px] items-center">
              {imgError ? (
                <p className="text-text-muted font-mono text-[11px]">
                  Failed to render diagram.{' '}
                  <button
                    type="button"
                    onClick={() => { setImgError(false); setView('code') }}
                    className="underline hover:text-text"
                  >
                    View code instead
                  </button>
                </p>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={svgUrl}
                  alt={title}
                  className="max-w-full h-auto"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          ) : (
            <pre
              className="px-4 py-3 font-mono text-[11.5px] text-text-muted overflow-x-auto leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          )}
        </div>
      )}
    </div>
  )
}
