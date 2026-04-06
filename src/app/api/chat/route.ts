import { NextRequest }  from 'next/server'
import { auth }          from '@/auth'
import { getAnalysisResult } from '@/lib/api/analyze.api'
import type { ChatRequest }  from '@/types/chat.types'
import type { PipelineResult } from '@/types/analysis.types'

// ── OpenAI streaming ──────────────────────────────────────────────────────────
// We call the OpenAI REST API directly with fetch() so this route stays
// compatible with Next.js Edge Runtime (no SDK needed).
const OPENAI_URL   = 'https://api.openai.com/v1/chat/completions'
const OPENAI_MODEL = 'gpt-4o'

// ── System prompt builder ─────────────────────────────────────────────────────

/**
 * Builds a focused system prompt from the PipelineResult.
 *
 * The AI receives:
 * - Project name, language, framework
 * - Only the modules the user selected (smells, metrics, cycles scoped to them)
 * - Instruction to refuse questions outside the selected scope
 *
 * We do NOT send raw source code — the backend never clones to disk permanently.
 * Instead we send the structural analysis data, which is rich enough to answer
 * architectural questions, security patterns, and dependency issues.
 */
function buildSystemPrompt(
  result:      PipelineResult,
  selectedIds: string[],
): string {
  const { projectName, detection, metrics, smells, cycles, hotspots } = result
  const lang      = detection.languages[0]?.name ?? 'unknown'
  const framework = detection.framework ?? 'none'

  // Filter smells to only those in selected modules
  const scopedSmells = selectedIds.length > 0
    ? smells.filter((s) => !s.module || selectedIds.some((id) => s.module?.includes(id) || id.includes(s.module ?? '')))
    : smells

  // Filter cycles to only those containing selected modules
  const scopedCycles = selectedIds.length > 0
    ? cycles.filter((c) => c.nodes.some((n) => selectedIds.some((id) => n.includes(id) || id.includes(n))))
    : cycles

  // Filter hotspots to selected modules
  const scopedHotspots = selectedIds.length > 0
    ? hotspots.filter((h) => selectedIds.some((id) => h.module.includes(id) || id.includes(h.module)))
    : hotspots

  const scopeLabel = selectedIds.length > 0
    ? selectedIds.join(', ')
    : 'entire codebase'

  return `You are an expert software architect assistant for the project "${projectName}".

SCOPE: Answer ONLY about the following modules/files: ${scopeLabel}
If the user asks about something outside this scope, politely say you only have context for the listed modules and suggest they add those files to the context.

PROJECT CONTEXT:
- Language: ${lang}
- Framework: ${framework}
- ORM: ${detection.orm ?? 'none'}
- Analysis depth: ${detection.analysisDepth}

ARCHITECTURE METRICS (full project):
- Module count: ${metrics.moduleCount}
- Dependency count: ${metrics.dependencyCount}
- Cycle count: ${metrics.cycleCount}
- Average fan-out: ${metrics.averageFanOut}
- Max fan-out: ${metrics.maxFanOut}
- Dependency density: ${(metrics.dependencyDensity * 100).toFixed(1)}%

SCOPED ARCHITECTURE SMELLS (${scopeLabel}):
${scopedSmells.length === 0
  ? '- None detected in scope'
  : scopedSmells.map((s) => `- [${s.severity.toUpperCase()}] ${s.type}: ${s.message}`).join('\n')
}

SCOPED CIRCULAR DEPENDENCIES:
${scopedCycles.length === 0
  ? '- None detected in scope'
  : scopedCycles.map((c) => `- ${c.nodes.join(' → ')}`).join('\n')
}

SCOPED HOTSPOTS:
${scopedHotspots.length === 0
  ? '- None in scope'
  : scopedHotspots.map((h) => `- ${h.module}: fan-out ${h.fanOut} (${h.risk} risk)`).join('\n')
}

INSTRUCTIONS:
1. Be specific — reference actual module names from the scope when relevant.
2. When identifying issues, explain WHY they are a problem and HOW to fix them.
3. Format code suggestions in fenced code blocks with the correct language tag.
4. Keep answers concise but complete. Do not repeat the system context back to the user.
5. If asked about something you cannot determine from the structural analysis (e.g. specific line numbers), say so clearly.`
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.accessToken) {
    return new Response('Unauthorized', { status: 401 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return new Response('OpenAI API key not configured', { status: 503 })
  }

  let body: ChatRequest
  try {
    body = await req.json() as ChatRequest
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { jobId, messages, selectedIds } = body

  if (!jobId || !Array.isArray(messages)) {
    return new Response('jobId and messages are required', { status: 400 })
  }

  // Fetch the analysis result to build the system prompt
  let result: PipelineResult
  try {
    result = await getAnalysisResult(jobId, session.accessToken)
  } catch {
    return new Response('Analysis result not found — it may have expired', { status: 404 })
  }

  const systemPrompt = buildSystemPrompt(result, selectedIds ?? [])

  // Call OpenAI with streaming enabled
  const openaiRes = await fetch(OPENAI_URL, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model:       OPENAI_MODEL,
      stream:      true,
      max_tokens:  1024,
      temperature: 0.3,   // lower = more precise for technical answers
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  })

  if (!openaiRes.ok || !openaiRes.body) {
    const err = await openaiRes.text()
    console.error('[POST /api/chat] OpenAI error:', err)
    return new Response('OpenAI request failed', { status: 502 })
  }

  // Transform the OpenAI SSE stream (data: {...}) → plain text stream
  // so the client hook can simply accumulate raw text chunks
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      const reader  = openaiRes.body!.getReader()
      const decoder = new TextDecoder()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          // OpenAI streams lines like: data: {"choices":[{"delta":{"content":"..."}}]}
          for (const line of chunk.split('\n')) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const json = trimmed.slice(5).trim()
            if (json === '[DONE]') continue

            try {
              const parsed = JSON.parse(json) as {
                choices?: { delta?: { content?: string } }[]
              }
              const text = parsed.choices?.[0]?.delta?.content
              if (text) controller.enqueue(encoder.encode(text))
            } catch {
              // Skip malformed chunks
            }
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type':  'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}
