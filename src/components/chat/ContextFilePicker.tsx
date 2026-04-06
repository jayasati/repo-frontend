'use client'

import { useChatStore }       from '@/features/chat/store/chat.store'
import { cn }                 from '@/lib/utils/cn'

/**
 * ContextFilePicker — lets the user select which modules the AI can see.
 *
 * Renders the contextFiles built from the analysis result.
 * Selections are stored in the Zustand chat store and sent with every
 * message so the server-side system prompt is always correctly scoped.
 */
export function ContextFilePicker() {
  const session       = useChatStore((s) => s.session)
  const toggleFile    = useChatStore((s) => s.toggleFile)
  const selectAllFiles = useChatStore((s) => s.selectAllFiles)

  if (!session) return null

  const { contextFiles, selectedIds } = session
  const totalTokens = contextFiles
    .filter((f) => selectedIds.includes(f.id))
    .reduce((sum, f) => sum + f.tokens, 0)

  // Context window budget — gpt-4o has 128k tokens;
  // we reserve ~2k for the fixed system prompt + conversation history.
  const MAX_TOKENS   = 6_000
  const usedPct      = Math.min((totalTokens / MAX_TOKENS) * 100, 100)
  const isOverBudget = totalTokens > MAX_TOKENS

  return (
    <div className="flex flex-col gap-1.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.08em]">
          Context scope
        </p>
        <button
          onClick={selectAllFiles}
          className="font-mono text-[10px] text-text-dim hover:text-accent transition-colors"
        >
          select all
        </button>
      </div>

      {/* File list */}
      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
        {contextFiles.map((file) => {
          const isSelected = selectedIds.includes(file.id)

          return (
            <button
              key={file.id}
              onClick={() => toggleFile(file.id)}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors w-full',
                isSelected
                  ? 'bg-accent/8 border border-accent/20'
                  : 'hover:bg-bg-surface2 border border-transparent',
              )}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  'w-3 h-3 rounded-sm border flex-shrink-0 flex items-center justify-center',
                  isSelected
                    ? 'bg-accent border-accent'
                    : 'border-text-dim',
                )}
              >
                {isSelected && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4l2 2 4-4" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                )}
              </div>

              {/* Label */}
              <span className={cn(
                'font-mono text-[11px] flex-1 truncate',
                isSelected ? 'text-accent' : 'text-text-muted',
              )}>
                {file.label}
              </span>

              {/* Token count */}
              <span className="font-mono text-[10px] text-text-dim flex-shrink-0">
                ~{file.tokens}t
              </span>
            </button>
          )
        })}
      </div>

      {/* Token budget bar */}
      <div className="mt-1">
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              isOverBudget ? 'bg-ra-red' : 'bg-accent',
            )}
            style={{ width: `${usedPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className={cn('font-mono text-[10px]', isOverBudget ? 'text-ra-red' : 'text-text-dim')}>
            {totalTokens.toLocaleString()} tokens used
          </span>
          <span className="font-mono text-[10px] text-text-dim">
            {MAX_TOKENS.toLocaleString()} budget
          </span>
        </div>
        {isOverBudget && (
          <p className="font-mono text-[10px] text-ra-amber mt-1">
            Over budget — deselect some files for better responses.
          </p>
        )}
      </div>
    </div>
  )
}
