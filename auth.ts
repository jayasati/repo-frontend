import NextAuth                from 'next-auth'
import CredentialsProvider     from 'next-auth/providers/credentials'
import { z }                   from 'zod'

/**
 * The `authorize` function runs server-side inside the Next.js process.
 * It cannot use the /backend rewrite proxy (that only works for browser requests).
 * So we import the API functions that hit the backend directly.
 *
 * Because this file is at the root (not inside src/), we need full imports.
 */
import { loginUser, getMe } from './src/lib/api/auth.api'
import { ApiError }         from './src/lib/api/client'

// ── Validation schema for credentials ───────────────────────────────────────

const credentialsSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

// ── NextAuth configuration ───────────────────────────────────────────────────

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,

  /**
   * Custom pages — NextAuth will redirect to these instead of its built-in UI.
   */
  pages: {
    signIn: '/login',
    error:  '/login',   // auth errors redirect to /login?error=...
  },

  /**
   * JWT strategy — no database session table needed.
   * The backend is the source of truth; we only store the token here.
   */
  session: { strategy: 'jwt' },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    // ── Credentials (email + password → NestJS backend) ──────────────────────
    CredentialsProvider({
      name:        'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
        /** Internal: bootstrap session after Nest GitHub OAuth redirect */
        nestJwt:  { label: 'Bootstrap', type: 'text' },
      },

      async authorize(credentials) {
        const nestJwt =
          typeof credentials?.nestJwt === 'string' ? credentials.nestJwt.trim() : ''
        if (nestJwt.length > 0) {
          try {
            const user = await getMe(nestJwt)
            return {
              id:           user.id,
              email:        user.email,
              role:         user.role,
              accessToken:  nestJwt,
              githubLinked: user.githubLinked === true,
            }
          } catch (err) {
            console.error('[NextAuth] nestJwt bootstrap error:', err)
            return null
          }
        }

        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        try {
          const { accessToken } = await loginUser(parsed.data)
          const user = await getMe(accessToken)

          return {
            id:           user.id,
            email:        user.email,
            role:         user.role,
            accessToken,
            githubLinked: user.githubLinked === true,
          }
        } catch (err) {
          if (err instanceof ApiError) {
            return null
          }
          console.error('[NextAuth] authorize error:', err)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id           = user.id ?? ''
        token.role         = (user.role as string) ?? 'user'
        token.accessToken  = (user.accessToken as string) ?? ''
        token.githubLinked =
          'githubLinked' in user && typeof user.githubLinked === 'boolean'
            ? user.githubLinked
            : undefined
      }
      return token
    },

    async session({ session, token }) {
      session.user.id    = token.id
      session.user.role  = token.role
      session.accessToken = token.accessToken
      if (typeof token.githubLinked === 'boolean') {
        session.githubLinked = token.githubLinked
      }
      return session
    },
  },
})
