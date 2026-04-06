import { create }            from 'zustand'
import type { ChatMessage, ContextFile, ChatSession } from '@/types/chat.types'

interface ChatState {
  session: ChatSession | null
  initSession:    (jobId: string, projectName: string, files: ContextFile[]) => void
  addMessage:     (msg: Omit<ChatMessage, 'id' | 'createdAt'>) => string
  updateMessage:  (id: string, patch: Partial<ChatMessage>) => void
  toggleFile:     (fileId: string) => void
  selectAllFiles: () => void
  clearMessages:  () => void
}

export const useChatStore = create<ChatState>()((set, get) => ({
  session: null,

  initSession: (jobId, projectName, files) => {
    const existing = get().session
    if (existing?.jobId === jobId) return
    set({
      session: {
        jobId,
        projectName,
        messages:     [],
        contextFiles: files,
        selectedIds:  files.slice(0, 3).map((f) => f.id),
      },
    })
  },

  addMessage: (msg) => {
    //  Web Crypto API — works in browser AND Node 19+
    const id  = crypto.randomUUID()
    const now = new Date().toISOString()
    set((s) => ({
      session: s.session
        ? { ...s.session, messages: [...s.session.messages, { ...msg, id, createdAt: now }] }
        : s.session,
    }))
    return id
  },

  updateMessage: (id, patch) => {
    set((s) => ({
      session: s.session
        ? {
            ...s.session,
            messages: s.session.messages.map((m) =>
              m.id === id ? { ...m, ...patch } : m,
            ),
          }
        : s.session,
    }))
  },

  toggleFile: (fileId) => {
    set((s) => {
      if (!s.session) return s
      const selected = s.session.selectedIds
      const next = selected.includes(fileId)
        ? selected.filter((id) => id !== fileId)
        : [...selected, fileId]
      return { session: { ...s.session, selectedIds: next } }
    })
  },

  selectAllFiles: () => {
    set((s) => {
      if (!s.session) return s
      return {
        session: {
          ...s.session,
          selectedIds: s.session.contextFiles.map((f) => f.id),
        },
      }
    })
  },

  clearMessages: () => {
    set((s) => ({
      session: s.session ? { ...s.session, messages: [] } : s.session,
    }))
  },
}))