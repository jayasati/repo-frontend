/**
 * Re-export NextAuth helpers from the root auth.ts for use inside src/.
 * This lets components and server code import from '@/auth' cleanly.
 */
export { auth, signIn, signOut, handlers } from '../auth'
