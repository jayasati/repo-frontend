import type { ApiKey, GeneratedApiKey } from '@/lib/api/auth.api'
import { apiFetch } from './client'

export type { ApiKey, GeneratedApiKey }

export async function listApiKeys(accessToken: string): Promise<Omit<ApiKey, 'key'>[]> {
  return apiFetch('/auth/api-keys', { method: 'GET', accessToken })
}

export async function generateApiKey(
  accessToken: string,
  name?: string,
): Promise<GeneratedApiKey> {
  return apiFetch('/auth/api-keys', { method: 'POST', accessToken, body: { name } })
}

export async function revokeApiKey(id: string, accessToken: string): Promise<void> {
  return apiFetch(`/auth/api-keys/${id}`, { method: 'DELETE', accessToken })
}