'use client'

import { useState }       from 'react'
import { Copy, Check }    from 'lucide-react'
import { cn }             from '@/lib/utils/cn'
import type { ChatMessage } from '@/types/chat.types'

interface ChatMessageProps {
  message: ChatMessage
}

/**
 * ChatMessage — renders user and assistant bubbles.
 *
 * Assistant messages support:
 * - Fenced code blocks (```lang\n...\n```) with copy button
 * - Inline code (`code`)
 * - Bold (**text**)
 * - Streaming cursor while message is incomplete
 *
 * We do this with a simple regex parser rather than a markdown library
 * to keep the bundle small and avoid SSR issues.
 */
export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      {/* Assistant badge */}
      {!isUser && (
        <div className="w-5 h-5 rounded bg-accent flex-shrink-0 flex items-center justify-center mr-2 mt-1">
          <span className="font-mono text-[8px] font-medium text-black">AI</span>
        </div>
      )}

      <div
        className={cn(
          'max-w-[82%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed',
          isUser
            ? 'bg-bg-surface2 text-text rounded-tr-sm'
            : 'bg-bg-surface border border-border text-text rounded-tl-sm',
        )}
      >
        {/* Scope badge */}
        {message.scopedTo && message.scopedTo.length > 0 && !isUser && (
          <div className="flex flex-wrap gap-1 mb-2">
            {message.scopedTo.map((id) => (
              <span
                key={id}
                className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20"
              >
                {id}
              </span>
            ))}
          </div>
        )}

        {/* Message content */}
        <MessageContent content={message.content} />

        {/* Streaming cursor */}
        {message.streaming && (
          <span className="inline-block w-1.5 h-3.5 bg-accent ml-0.5 animate-pulse rounded-sm" />
        )}
      </div>
    </div>
  )
}

// ── Lightweight content renderer ──────────────────────────────────────────────

function MessageContent({ content }: { content: string }) {
  if (!content) return null

  // Split by fenced code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          return <FencedBlock key={i} raw={part} />
        }
        return <InlineContent key={i} text={part} />
      })}
    </>
  )
}

function FencedBlock({ raw }: { raw: string }) {
  const [copied, setCopied] = useState(false)

  // Parse ```lang\ncode\n```
  const match = raw.match(/^```(\w*)\n?([\s\S]*?)\n?```$/)
  const lang  = match?.[1] ?? ''
  const code  = match?.[2] ?? raw

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-border">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-bg-surface2 border-b border-border">
        <span className="font-mono text-[10px] text-text-dim">{lang || 'code'}</span>
        <button
          onClick={() => void handleCopy()}
          className="flex items-center gap-1 font-mono text-[10px] text-text-dim hover:text-text transition-colors"
        >
          {copied
            ? <><Check className="h-3 w-3 text-accent" />copied</>
            : <><Copy className="h-3 w-3" />copy</>
          }
        </button>
      </div>
      <pre className="px-3 py-2.5 bg-bg overflow-x-auto text-[11.5px] font-mono text-text-muted leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function InlineContent({ text }: { text: string }) {
  // Process bold, inline code, and plain text
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="font-mono text-[11.5px] bg-bg-surface2 text-accent px-1 py-0.5 rounded"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-medium text-text">{part.slice(2, -2)}</strong>
        }
        // Preserve newlines as <br>
        return (
          <span key={i}>
            {part.split('\n').map((line, j, arr) => (
              <span key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))}
          </span>
        )
      })}
    </>
  )
}
