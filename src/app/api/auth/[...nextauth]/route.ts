/**
 * NextAuth v5 route handler.
 * Exports GET and POST handlers that NextAuth uses to process
 * sign-in, sign-out, session fetching, and OAuth callbacks.
 */
import { handlers } from '@/auth'

export const { GET, POST } = handlers
