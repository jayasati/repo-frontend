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

interface SourceTreeResponse {
  rootHint: string
  entries: Array<{
    path: string
    type: 'dir' | 'file'
  }>
}

/**
 * Builds ContextFile list from PipelineResult.
 *
 * Strategy: infer repo-relative directories from file nodes in the unified graph
 * (e.g. "src/auth") so the user can scope the LLM to real source folders.
 *
 * Note: tokens are rough estimates; the server will enforce real byte/token caps.
 */
function buildContextFiles(result: PipelineResult): ContextFile[] {
  const dirCounts = new Map<string, number>()
  const sampleFilesByDir = new Map<string, string[]>()
  const discoveredFiles = new Set<string>()

  const isFileLike = (p: string): boolean => /\.[a-z0-9]+$/i.test(p)

  const isIgnoredPath = (p: string): boolean => {
    const x = p.toLowerCase()
    return (
      x.includes('/.tmp/') ||
      x.includes('/node_modules/') ||
      x.includes('/dist/') ||
      x.includes('/build/') ||
      x.includes('/coverage/') ||
      x.includes('/.next/') ||
      x.includes('/.git/')
    )
  }

  const toRepoRelativeFile = (rawPath: string): string | null => {
    const normalized = rawPath.replace(/\\/g, '/').trim()
    if (!normalized.includes('/')) return null
    if (!isFileLike(normalized)) return null
    if (isIgnoredPath(normalized)) return null

    // Most analyses include absolute paths; strip to a repo-relative anchor.
    for (const marker of ['/src/', '/app/', '/packages/', '/libs/', '/lib/']) {
      const idx = normalized.lastIndexOf(marker)
      if (idx >= 0) return normalized.slice(idx + 1) // keep the anchor segment (e.g. src/...)
    }

    // If already repo-relative, keep as-is.
    if (!/^[a-zA-Z]:\//.test(normalized) && !normalized.startsWith('/')) return normalized
    return null
  }

  const recordFilePath = (rawPath: string) => {
    const file = toRepoRelativeFile(rawPath)
    if (!file) return
    discoveredFiles.add(file)
    const parts = file.split('/').filter(Boolean)
    if (parts.length < 2) return

    // Count this file for every parent directory so folder selection works as a true subtree scope.
    for (let i = 1; i < parts.length; i += 1) {
      const dir = parts.slice(0, i).join('/')
      dirCounts.set(dir, (dirCounts.get(dir) ?? 0) + 1)
      const samples = sampleFilesByDir.get(dir) ?? []
      if (samples.length < 3) {
        samples.push(file)
        sampleFilesByDir.set(dir, samples)
      }
    }
  }

  for (const n of result.unifiedGraph.nodes) {
    recordFilePath(n.id ?? '')
  }

  // Fallback: some graphs may have sparse nodes but useful edge endpoints.
  if (dirCounts.size === 0) {
    for (const e of result.unifiedGraph.edges) {
      recordFilePath(e.from ?? '')
      recordFilePath(e.to ?? '')
    }
  }

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

  // One entry per discovered directory in the real source tree.
  const scopes = Array.from(dirCounts.entries())
    .sort((a, b) => {
      const aDepth = a[0].split('/').length
      const bDepth = b[0].split('/').length
      if (aDepth !== bDepth) return aDepth - bDepth
      if (b[1] !== a[1]) return b[1] - a[1]
      return a[0].localeCompare(b[0])
    })
    .map(([scope]) => scope)

  for (const scope of scopes) {
    const fileCount = dirCounts.get(scope) ?? 0
    // Rough estimate for folder context size; backend enforces real caps.
    const tokens = Math.max(80, Math.min(4500, fileCount * 120))
    const samples = sampleFilesByDir.get(scope) ?? []
    files.push({
      id: scope,
      label: `${scope} (${fileCount} files)`,
      tokens,
      content: `Source scope: ${scope}\nEstimated files: ${fileCount}\nSample files:\n${samples.map((s) => `- ${s}`).join('\n')}`,
    })
  }

  // Include actual file leaves so the context tree mirrors codebase structure exactly.
  const fileEntries = Array.from(discoveredFiles).sort((a, b) => a.localeCompare(b))
  for (const filePath of fileEntries) {
    files.push({
      id: filePath,
      label: filePath.split('/').pop() ?? filePath,
      tokens: 90,
      content: `Source file: ${filePath}`,
    })
  }

  return files
}

function buildContextFilesFromSourceTree(result: PipelineResult, tree: SourceTreeResponse): ContextFile[] {
  const files: ContextFile[] = [
    {
      id:      '__overview__',
      label:   'Project overview',
      tokens:  120,
      content: `Project: ${result.projectName}
Language: ${result.detection.languages[0]?.name ?? 'unknown'}
Framework: ${result.detection.framework ?? 'none'}
Source root: ${tree.rootHint}
Overall score: ${result.score.overall}/100
Modules: ${result.metrics.moduleCount}, Dependencies: ${result.metrics.dependencyCount}
Cycles: ${result.metrics.cycleCount}, Smells: ${result.smells.length}`,
    },
  ]

  const normalized = tree.entries
    .map((e) => ({ ...e, path: e.path.replace(/\\/g, '/').replace(/^\/+/, '') }))
    .filter((e) => e.path.length > 0)

  const filePaths = normalized.filter((e) => e.type === 'file').map((e) => e.path)
  const fileSet = new Set(filePaths)

  // Ensure parent directories exist even if backend response is sparse.
  const dirSet = new Set(normalized.filter((e) => e.type === 'dir').map((e) => e.path))
  for (const filePath of filePaths) {
    const parts = filePath.split('/').filter(Boolean)
    for (let i = 1; i < parts.length; i += 1) {
      dirSet.add(parts.slice(0, i).join('/'))
    }
  }

  const dirFileCounts = new Map<string, number>()
  for (const filePath of fileSet) {
    const parts = filePath.split('/').filter(Boolean)
    for (let i = 1; i < parts.length; i += 1) {
      const dir = parts.slice(0, i).join('/')
      dirFileCounts.set(dir, (dirFileCounts.get(dir) ?? 0) + 1)
    }
  }

  const sortedDirs = Array.from(dirSet).sort((a, b) => {
    const aDepth = a.split('/').length
    const bDepth = b.split('/').length
    if (aDepth !== bDepth) return aDepth - bDepth
    return a.localeCompare(b)
  })

  for (const dir of sortedDirs) {
    const count = dirFileCounts.get(dir) ?? 0
    if (count === 0) continue
    files.push({
      id: dir,
      label: `${dir} (${count} files)`,
      tokens: Math.max(80, Math.min(4500, count * 120)),
      content: `Source scope: ${dir}\nEstimated files: ${count}`,
    })
  }

  const sortedFiles = Array.from(fileSet).sort((a, b) => a.localeCompare(b))
  for (const filePath of sortedFiles) {
    files.push({
      id: filePath,
      label: filePath.split('/').pop() ?? filePath,
      tokens: 90,
      content: `Source file: ${filePath}`,
    })
  }

  return files
}

export function ChatWindow({ result, jobId }: ChatWindowProps) {
  const { initSession, clearMessages, session } = useChatStore()
  const { send, cancel, isStreaming }           = useChat()
  const bottomRef                               = useRef<HTMLDivElement>(null)

  // Initialise session from exact source tree; fallback to graph-derived scopes.
  useEffect(() => {
    // Avoid re-fetching context tree on unrelated re-renders.
    if (session?.jobId === jobId && session.contextFiles.length > 0) return

    let cancelled = false

    ;(async () => {
      try {
        const res = await fetch(`/api/chat/context-tree?jobId=${encodeURIComponent(jobId)}&maxEntries=5000`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const tree = await res.json() as SourceTreeResponse
        if (!tree || !Array.isArray(tree.entries) || tree.entries.length === 0) {
          throw new Error('Empty source tree')
        }
        if (cancelled) return
        const files = buildContextFilesFromSourceTree(result, tree)
        initSession(jobId, result.projectName, files)
      } catch {
        if (cancelled) return
        const files = buildContextFiles(result)
        initSession(jobId, result.projectName, files)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [jobId, result, initSession, session?.jobId, session?.contextFiles.length])

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
