'use client'

import { useRef, useState, KeyboardEvent } from 'react'
import { Send, X }                          from 'lucide-react'
import { cn }                               from '@/lib/utils/cn'

const SUGGESTIONS = [
  'What are the main architecture issues?',
  'How does auth work in this project?',
  'Are there any circular dependencies?',
  'Which module has the most risk?',
  'How can I reduce coupling here?',
]

interface ChatInputProps {
  onSend:      (text: string) => void
  onCancel:    () => void
  isStreaming: boolean
  disabled?:  boolean
}

export function ChatInput({ onSend, onCancel, isStreaming, disabled }: ChatInputProps) {
  const [value,        setValue]        = useState('')
  const [showSuggest,  setShowSuggest]  = useState(true)
  const textareaRef                     = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isStreaming) return
    onSend(trimmed)
    setValue('')
    setShowSuggest(false)
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Suggestion chips — shown until first message */}
      {showSuggest && (
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setValue(s); setShowSuggest(false); textareaRef.current?.focus() }}
              className="px-2.5 py-1 bg-bg-surface border border-border rounded-md font-mono text-[11px] text-text-muted hover:border-accent hover:text-accent transition-colors text-left"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className={cn(
        'flex items-end gap-2 bg-bg-surface border rounded-xl p-2.5 transition-colors',
        disabled ? 'border-border opacity-60' : 'border-border focus-within:border-accent',
      )}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => { setValue(e.target.value); handleInput() }}
          onKeyDown={handleKeyDown}
          disabled={disabled || isStreaming}
          placeholder={isStreaming ? 'AI is responding…' : 'Ask about your codebase… (⌘↵ to send)'}
          rows={1}
          className={cn(
            'flex-1 bg-transparent resize-none outline-none font-sans text-[13px] text-text',
            'placeholder:text-text-dim caret-accent leading-relaxed',
            'disabled:cursor-not-allowed',
          )}
          style={{ minHeight: '22px', maxHeight: '160px' }}
        />

        {/* Send / Cancel button */}
        {isStreaming ? (
          <button
            onClick={onCancel}
            className="w-7 h-7 flex-shrink-0 rounded-md bg-ra-red/20 border border-ra-red/30 flex items-center justify-center text-ra-red hover:bg-ra-red/30 transition-colors"
            title="Cancel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className={cn(
              'w-7 h-7 flex-shrink-0 rounded-md flex items-center justify-center transition-colors',
              value.trim() && !disabled
                ? 'bg-accent text-black hover:bg-accent/90'
                : 'bg-bg-surface2 text-text-dim cursor-not-allowed',
            )}
            title="Send (⌘↵)"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <p className="font-mono text-[10px] text-text-dim text-right">
        ⌘↵ send · context scoped to selected modules only
      </p>
    </div>
  )
}
