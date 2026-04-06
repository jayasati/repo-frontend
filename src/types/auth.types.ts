/**
 * Auth types — must mirror NestJS backend DTOs to avoid runtime mismatches.
 * Update these if the backend changes its response shapes.
 */

// ── Request payloads ────────────────────────────────────────────────────────

export interface LoginCredentials {
  email:    string
  password: string
}

export interface RegisterCredentials {
  email:    string
  password: string
}

// ── Response shapes ─────────────────────────────────────────────────────────

/** Returned by POST /auth/login and POST /auth/register */
export interface AuthTokenResponse {
  accessToken: string
}

/** Returned by GET /auth/me */
export interface MeResponse {
  id:            string
  email:         string
  role:          string
  /** True when GitHub OAuth completed on Nest (token stored server-side). */
  githubLinked?: boolean
}

/** The full user shape we store in the NextAuth session */
export interface AuthUser {
  id:          string
  email:       string
  role:        string
  /** Backend-issued JWT — attached to every API request as Bearer token */
  accessToken: string
}

// ── Error shapes ─────────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  statusCode: number
  message:    string | string[]
  path?:      string
  timestamp?: string
}
