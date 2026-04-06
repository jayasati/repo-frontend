import type { DefaultSession, DefaultUser } from 'next-auth'
import type { DefaultJWT }                  from 'next-auth/jwt'

/**
 * Augment the built-in NextAuth types so TypeScript knows about
 * our custom fields (accessToken, role) without casting everywhere.
 */
declare module 'next-auth' {
  interface Session {
    /** NestJS-issued JWT — attached to every API request as Bearer token */
    accessToken: string
    /** Mirrors Nest DB — GitHub token lives on server, not in this session */
    githubLinked?: boolean
    user: {
      id:   string
      role: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role:         string
    accessToken:  string
    githubLinked?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id:           string
    role:         string
    accessToken:  string
    githubLinked?: boolean
  }
}
