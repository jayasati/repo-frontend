'use client'

import { useCallback, useRef, useState } from 'react'
import { useChatStore }                   from '@/features/chat/store/chat.store'

/**
 * useChat — sends a user message and streams the assistant response.
 *
 * Flow:
 * 1. Append user message to store immediately (optimistic).
 * 2. POST /api/chat with jobId, full message history, selected file IDs.
 * 3. Read the streamed text/plain response chunk-by-chunk.
 * 4. Patch the (initially empty) assistant message in the store each chunk.
 * 5. Mark streaming=false when the stream ends.
 */
export function useChat() {
  const { session, addMessage, updateMessage } = useChatStore()
  const [isStreaming, setIsStreaming]           = useState(false)
  const [error,       setError]                = useState<string | null>(null)
  const abortRef                               = useRef<AbortController | null>(null)

  const send = useCallback(async (userText: string) => {
    if (!session || !userText.trim() || isStreaming) return

    setError(null)

    // 1. Add user message
    addMessage({ role: 'user', content: userText.trim(), scopedTo: session.selectedIds })

    // 2. Add placeholder assistant message that we'll stream into
    const assistantId = addMessage({
      role:      'assistant',
      content:   '',
      streaming: true,
      scopedTo:  session.selectedIds,
    })

    setIsStreaming(true)
    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          jobId:       session.jobId,
          messages:    session.messages
            .filter((m) => !m.streaming)
            .map((m) => ({ role: m.role, content: m.content }))
            .concat([{ role: 'user', content: userText.trim() }]),
          selectedIds: session.selectedIds,
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(body.message ?? `HTTP ${res.status}`)
      }

      // 3. Stream the response
      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let   accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk

        // 4. Patch the assistant message with accumulated content
        updateMessage(assistantId, { content: accumulated, streaming: true })
      }

      // 5. Mark complete
      updateMessage(assistantId, { content: accumulated, streaming: false })

    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        updateMessage(assistantId, { content: '*(cancelled)*', streaming: false })
        return
      }
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      updateMessage(assistantId, { content: `*(Error: ${msg})*`, streaming: false })
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }, [session, isStreaming, addMessage, updateMessage])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { send, cancel, isStreaming, error }
}
