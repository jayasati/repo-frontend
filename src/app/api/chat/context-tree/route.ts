import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const jobId = req.nextUrl.searchParams.get('jobId')
  if (!jobId) {
    return NextResponse.json({ message: 'jobId is required' }, { status: 400 })
  }

  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
  const maxEntries = req.nextUrl.searchParams.get('maxEntries') ?? '5000'

  const headers: Record<string, string> = {}
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`
  }

  const deriveEntriesFromAnalysis = (analysis: unknown): Array<{ path: string; type: 'dir' | 'file' }> => {
    const graph = (
      analysis &&
      typeof analysis === 'object' &&
      'unifiedGraph' in analysis &&
      (analysis as { unifiedGraph?: unknown }).unifiedGraph &&
      typeof (analysis as { unifiedGraph?: unknown }).unifiedGraph === 'object'
    )
      ? ((analysis as { unifiedGraph: { nodes?: Array<{ id?: string }>; edges?: Array<{ from?: string; to?: string }> } }).unifiedGraph)
      : undefined

    const files = new Set<string>()
    const dirs = new Set<string>()
    const isFileLike = (p: string): boolean => /\.[a-z0-9]+$/i.test(p)
    const ignored = (p: string): boolean => {
      const x = p.toLowerCase()
      return x.includes('/node_modules/') || x.includes('/.git/') || x.includes('/dist/') || x.includes('/build/')
    }
    const normalizeToRelative = (raw: string): string | null => {
      const p = raw.replace(/\\/g, '/').trim()
      if (!p || ignored(p) || !isFileLike(p)) return null
      for (const marker of ['/src/', '/app/', '/packages/', '/libs/', '/lib/']) {
        const idx = p.lastIndexOf(marker)
        if (idx >= 0) return p.slice(idx + 1)
      }
      if (!/^[a-zA-Z]:\//.test(p) && !p.startsWith('/')) return p
      return null
    }
    const addFile = (raw?: string) => {
      if (!raw) return
      const rel = normalizeToRelative(raw)
      if (!rel) return
      files.add(rel)
      const parts = rel.split('/').filter(Boolean)
      for (let i = 1; i < parts.length; i += 1) {
        dirs.add(parts.slice(0, i).join('/'))
      }
    }

    for (const n of graph?.nodes ?? []) addFile(n.id)
    for (const e of graph?.edges ?? []) {
      addFile(e.from)
      addFile(e.to)
    }

    const dirEntries = Array.from(dirs)
      .sort((a, b) => {
        const ad = a.split('/').length
        const bd = b.split('/').length
        if (ad !== bd) return ad - bd
        return a.localeCompare(b)
      })
      .map((path) => ({ path, type: 'dir' as const }))
    const fileEntries = Array.from(files).sort((a, b) => a.localeCompare(b)).map((path) => ({ path, type: 'file' as const }))
    return [...dirEntries, ...fileEntries]
  }

  const parseTree = async (res: Response): Promise<null | { rootHint: string; entries: unknown[] }> => {
    const data = await res.json().catch(() => null) as null | { rootHint?: string; entries?: unknown[] }
    if (!data || !Array.isArray(data.entries)) return null
    return {
      rootHint: typeof data.rootHint === 'string' ? data.rootHint : 'unknown',
      entries: data.entries,
    }
  }

  try {
    // Primary path: dedicated copilot source-tree endpoint.
    const copilotRes = await fetch(`${base}/copilot/${jobId}/source-tree?maxEntries=${encodeURIComponent(maxEntries)}`, {
      headers,
    })
    const copilotTree = await parseTree(copilotRes)
    if (copilotRes.ok && copilotTree) {
      return NextResponse.json(copilotTree)
    }

    // Fallback path: analyze source-tree endpoint for older/copilot-limited backends.
    const analyzeRes = await fetch(`${base}/analyze/${jobId}/source-tree`, { headers })
    const analyzeTree = await parseTree(analyzeRes)
    if (analyzeRes.ok && analyzeTree) {
      return NextResponse.json(analyzeTree)
    }

    // Last-resort fallback: derive tree directly from analysis result.
    const analysisRes = await fetch(`${base}/analyze/${jobId}`, { headers })
    const analysis = await analysisRes.json().catch(() => null)
    if (analysisRes.ok && analysis) {
      const entries = deriveEntriesFromAnalysis(analysis)
      if (entries.length > 0) {
        const rootHint = typeof analysis.projectName === 'string' ? analysis.projectName : 'derived'
        return NextResponse.json({ rootHint, entries })
      }
    }

    // Keep chat usable when source-tree is unavailable.
    if (copilotRes.status === 404 || analyzeRes.status === 404) {
      return NextResponse.json({
        rootHint: 'unavailable',
        entries: [],
      })
    }

    const status = copilotRes.status >= 400 ? copilotRes.status : analyzeRes.status
    if (status >= 400) {
      return NextResponse.json({ message: 'Failed to load source tree' }, { status })
    }
    return NextResponse.json({ message: 'Failed to load source tree' }, { status: 502 })
  } catch {
    return NextResponse.json({
      rootHint: 'unavailable',
      entries: [],
    })
  }
}
