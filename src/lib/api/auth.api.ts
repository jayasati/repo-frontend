/**
 * Auth API functions.
 *
 * These are thin, typed wrappers around the NestJS /auth endpoints.
 * They work both server-side (NextAuth authorize callback) and client-side.
 *
 * Server-side calls (NextAuth) use the direct NEXT_PUBLIC_API_URL because the
 * /backend rewrite proxy only applies to browser requests processed by Next.js.
 */

import type {
  LoginCredentials,
  RegisterCredentials,
  AuthTokenResponse,
  MeResponse,
} from '@/types/auth.types'
import { apiFetch } from './client'

// ── Public endpoints (no auth header needed) ─────────────────────────────────

/**
 * POST /auth/login
 * Returns { accessToken } — the backend-issued JWT.
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthTokenResponse> {
  return apiFetch<AuthTokenResponse>('/auth/login', {
    method: 'POST',
    body:   credentials,
  })
}

/**
 * POST /auth/register
 * Returns { accessToken } on success.
 */
export async function registerUser(credentials: RegisterCredentials): Promise<AuthTokenResponse> {
  return apiFetch<AuthTokenResponse>('/auth/register', {
    method: 'POST',
    body:   credentials,
  })
}

// ── Protected endpoints (require accessToken) ────────────────────────────────

/**
 * GET /auth/me
 * Returns the current user's profile from the backend.
 * Used after login to populate the NextAuth session with user details.
 */
export async function getMe(accessToken: string): Promise<MeResponse> {
  return apiFetch<MeResponse>('/auth/me', {
    method:      'GET',
    accessToken,
  })
}

// ── API Key management ────────────────────────────────────────────────────────

export interface ApiKey {
  id:        string
  prefix:    string
  name?:     string
  active:    boolean
  createdAt: string
}

export interface GeneratedApiKey extends ApiKey {
  key: string   // plaintext — shown ONCE, never stored
}

/**
 * POST /auth/api-keys
 * Generates a new API key. The plaintext key is returned only once.
 */
export async function generateApiKey(
  accessToken: string,
  name?:       string,
): Promise<GeneratedApiKey> {
  return apiFetch<GeneratedApiKey>('/auth/api-keys', {
    method:      'POST',
    accessToken,
    body:        { name },
  })
}

/**
 * GET /auth/api-keys
 * Lists all active API keys (without plaintext — only prefix shown).
 */
export async function listApiKeys(accessToken: string): Promise<Omit<ApiKey, 'key'>[]> {
  return apiFetch<Omit<ApiKey, 'key'>[]>('/auth/api-keys', {
    method:      'GET',
    accessToken,
  })
}

/**
 * DELETE /auth/api-keys/:id
 * Revokes an API key by ID.
 */
export async function revokeApiKey(id: string, accessToken: string): Promise<void> {
  return apiFetch<void>(`/auth/api-keys/${id}`, {
    method:      'DELETE',
    accessToken,
  })
}
