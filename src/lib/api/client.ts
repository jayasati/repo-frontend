/**
 * API Client — universal (works in both browser and server)
 *
 * ✔ Browser → uses `/backend/*` (Next.js rewrite → avoids CORS)
 * ✔ Server  → uses absolute backend URL (`API_URL`)
 */

export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.status = status
    this.data = data
  }

  get isUnauthorized() { return this.status === 401 }
  get isForbidden() { return this.status === 403 }
  get isNotFound() { return this.status === 404 }
  get isConflict() { return this.status === 409 }
  get isBadRequest() { return this.status === 400 }
}

// ─────────────────────────────────────────────────────────────
// EXTENDED OPTIONS
// ─────────────────────────────────────────────────────────────

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: any
  accessToken?: string
}

// ─────────────────────────────────────────────────────────────
// 🌍 BASE URL (🔥 FINAL FIX)
// ─────────────────────────────────────────────────────────────

/**
 * Server-side base URL for the NestJS API.
 * Uses API_URL (runtime env, not baked at build time) so it resolves
 * correctly inside Docker (e.g. http://api:3000).
 */
export function serverApiBase(): string {
  return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '')
}

const BASE_URL =
  typeof window === 'undefined'
    ? serverApiBase()
    : '/backend'

// ─────────────────────────────────────────────────────────────
// CORE FETCH FUNCTION
// ─────────────────────────────────────────────────────────────

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`

  // DEBUG (remove later)
  console.log('API CALL →', url)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  //  Attach JWT if provided
  if (options.accessToken) {
    headers['Authorization'] = `Bearer ${options.accessToken}`
  }

  //  Auto stringify body
  const body =
    options.body && typeof options.body !== 'string'
      ? JSON.stringify(options.body)
      : options.body

  const res = await fetch(url, {
    ...options,
    headers,
    body,
  })

  let data: any = null

  try {
    data = await res.json()
  } catch {
    // ignore empty body
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `HTTP ${res.status}`

    throw new ApiError(res.status, message, data)
  }

  return data as T
}