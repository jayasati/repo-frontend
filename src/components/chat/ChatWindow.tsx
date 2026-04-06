'use client'

import { useEffect, useRef }      from 'react'
import { Trash2 }                  from 'lucide-react'
import { useChatStore }            from '@/features/chat/store/chat.store'
import { useChat }                 from '@/hooks/useChat'
import { ContextFilePicker }       from './ContextFilePicker'
import { ChatMessageBubble }       from './ChatMessage'
import { ChatInput }               from './ChatInput'
import type { PipelineResult }     from '@/types/analysis.types'
import type { ContextFile }        from '@/types/chat.types'

interface ChatWindowProps {
  result: PipelineResult
  jobId:  string
}

/**
 * Builds ContextFile list from PipelineResult.
 *
 * Strategy: each unique top-level module becomes one context file.
 * The "content" field is a structured text summary of that module's
 * smells, hotspots, and cycle memberships — the AI gets rich context
 * without needing raw source code.
 */
function buildContextFiles(result: PipelineResult): ContextFile[] {
  // Collect unique module names from smells + hotspots + cycles
  const moduleNames = new Set<string>()

  result.smells.forEach((s)    => { if (s.module) moduleNames.add(s.module) })
  result.hotspots.forEach((h)  => moduleNames.add(h.module))
  result.cycles.forEach((c)    => c.nodes.forEach((n) => moduleNames.add(n)))

  // Always include a "full project overview" entry
  const files: ContextFile[] = [
    {
      id:      '__overview__',
      label:   'Project overview',
      tokens:  120,
      content: `Project: ${result.projectName}
Language: ${result.detection.languages[0]?.name ?? 'unknown'}
Framework: ${result.detection.framework ?? 'none'}
Overall score: ${result.score.overall}/100
Modularity: ${result.score.breakdown.modularity}, Coupling: ${result.score.breakdown.coupling}, Smells: ${result.score.breakdown.smells}
Modules: ${result.metrics.moduleCount}, Dependencies: ${result.metrics.dependencyCount}
Cycles: ${result.metrics.cycleCount}, Smells: ${result.smells.length}`,
    },
  ]

  // One file per module
  for (const name of moduleNames) {
    const moduleSmells   = result.smells.filter((s) => s.module === name)
    const moduleHotspot  = result.hotspots.find((h) => h.module === name)
    const moduleCycles   = result.cycles.filter((c) => c.nodes.includes(name))

    const lines: string[] = [`Module: ${name}`]

    if (moduleSmells.length > 0) {
      lines.push('Smells:')
      moduleSmells.forEach((s) => lines.push(`  - [${s.severity}] ${s.type}: ${s.message}`))
    }
    if (moduleHotspot) {
      lines.push(`Hotspot: fan-out ${moduleHotspot.fanOut} (${moduleHotspot.risk} risk)`)
    }
    if (moduleCycles.length > 0) {
      lines.push('Involved in cycles:')
      moduleCycles.forEach((c) => lines.push(`  - ${c.nodes.join(' → ')}`))
    }

    const content = lines.join('\n')
    // Rough token estimate: ~4 chars per token
    const tokens  = Math.ceil(content.length / 4)

    files.push({ id: name, label: name, content, tokens })
  }

  return files
}

export function ChatWindow({ result, jobId }: ChatWindowProps) {
  const { initSession, clearMessages, session } = useChatStore()
  const { send, cancel, isStreaming }           = useChat()
  const bottomRef                               = useRef<HTMLDivElement>(null)

  // Initialise the session once when the component mounts
  useEffect(() => {
    const files = buildContextFiles(result)
    initSession(jobId, result.projectName, files)
  }, [jobId, result, initSession])

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session?.messages])

  if (!session) return null

  const hasMessages = session.messages.length > 0

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left: context file picker ──────────────────────────────────── */}
      <div className="w-52 flex-shrink-0 border-r border-border p-3 flex flex-col gap-3 bg-bg">
        <div>
          <p className="font-mono text-[11px] text-text-dim uppercase tracking-[0.08em] mb-3">
            Context scope
          </p>
          <ContextFilePicker />
        </div>

        <div className="mt-auto pt-3 border-t border-border">
          <p className="font-mono text-[10px] text-text-dim leading-relaxed">
            The AI only reads the selected modules. Narrower scope = more accurate answers.
          </p>
        </div>
      </div>

      {/* ── Right: chat panel ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg-surface flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent flex items-center justify-center">
              <span className="font-mono text-[8px] font-medium text-black">AI</span>
            </div>
            <span className="text-[13px] font-medium text-text">Codebase chat</span>
            <span className="font-mono text-[11px] text-text-dim">{result.projectName}</span>
          </div>

          {hasMessages && (
            <button
              onClick={clearMessages}
              className="flex items-center gap-1.5 font-mono text-[11px] text-text-dim hover:text-ra-red transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0">
          {!hasMessages ? (
            /* Welcome state */
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-12">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <div className="w-5 h-5 rounded bg-accent flex items-center justify-center">
                  <span className="font-mono text-[9px] font-medium text-black">AI</span>
                </div>
              </div>
              <div>
                <p className="text-[14px] font-medium text-text mb-1">Ask about your codebase</p>
                <p className="text-[12px] text-text-muted max-w-xs">
                  The AI has access to the structural analysis of{' '}
                  <span className="text-accent">{result.projectName}</span>.
                  Select modules on the left to scope the context.
                </p>
              </div>
            </div>
          ) : (
            session.messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-border flex-shrink-0">
          <ChatInput
            onSend={send}
            onCancel={cancel}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  )
}
