/**
 * Chat types for the LLM codebase assistant.
 *
 * The chat is scoped to a specific analysis job so the AI only sees
 * the context the user explicitly selects from that job's results.
 */

export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id:        string
  role:      MessageRole
  content:   string
  /** Which files were in scope when this message was sent */
  scopedTo?: string[]
  /** ISO timestamp */
  createdAt: string
  /** True while the assistant is still streaming its response */
  streaming?: boolean
}

/**
 * A single file in scope for the AI context.
 * Built from the PipelineResult — we use the smell/metric data as
 * structured context rather than raw source code (which we don't have).
 */
export interface ContextFile {
  /** e.g. "src/auth", "src/users", "auth.service.ts" */
  id:      string
  label:   string
  /** What the AI will receive as context for this file/module */
  content: string
  /** Approximate token count so user knows how much context is used */
  tokens:  number
}

export interface ChatSession {
  jobId:        string
  projectName:  string
  messages:     ChatMessage[]
  contextFiles: ContextFile[]
  /** IDs of ContextFile currently selected by the user */
  selectedIds:  string[]
}

/** Shape sent to POST /api/chat */
export interface ChatRequest {
  jobId:       string
  messages:    { role: MessageRole; content: string }[]
  selectedIds: string[]
}
