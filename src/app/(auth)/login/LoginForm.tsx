'use client'

import { useState }               from 'react'
import { useForm }                 from 'react-hook-form'
import { zodResolver }             from '@hookform/resolvers/zod'
import { signIn }                  from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link                        from 'next/link'
import { Eye, EyeOff, Mail, Lock, Github } from 'lucide-react'
import { toast }                   from 'sonner'

import { Button }  from '@/components/ui/button'
import { Input }   from '@/components/ui/input'
import { loginSchema, type LoginFormValues } from '@/lib/utils/validation'
import { nestGithubOAuthStartUrl }           from '@/lib/constants/nest-api'

/**
 * LoginForm — fully client-side.
 *
 * Flow:
 * 1. User submits email + password.
 * 2. We call NextAuth `signIn('credentials', ...)` — this hits our
 *    NextAuth authorize callback which calls the NestJS backend.
 * 3. On success, redirect to `callbackUrl` (defaults to /dashboard).
 * 4. On failure, show a toast with the error message.
 */
export default function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/dashboard'

  const [showPassword, setShowPassword] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // ── Credentials submit ────────────────────────────────────────────────────

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await signIn('credentials', {
        email:       values.email,
        password:    values.password,
        redirect:    false,   // handle redirect manually so we can show errors
        callbackUrl,
      })

      if (!result || result.error) {
        // NextAuth returns error='CredentialsSignin' on failure
        toast.error('Invalid email or password. Please try again.')
        return
      }

      toast.success('Welcome back!')
      router.push(callbackUrl)
      router.refresh()   // force server components to re-read session
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  // ── GitHub OAuth ──────────────────────────────────────────────────────────

  const handleGithubSignIn = () => {
    setIsGithubLoading(true)
    window.location.assign(nestGithubOAuthStartUrl())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-text mb-1">Sign in</h1>
        <p className="text-[13px] text-text-muted">
          New here?{' '}
          <Link
            href="/register"
            className="text-accent hover:underline underline-offset-4 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* GitHub OAuth — only rendered when configured */}
      {process.env.NEXT_PUBLIC_GITHUB_ENABLED === 'true' && (
        <>
          <Button
            variant="github"
            size="full"
            loading={isGithubLoading}
            onClick={handleGithubSignIn}
            type="button"
          >
            <Github className="h-4 w-4" />
            Continue with GitHub
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] text-text-dim font-mono">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </>
      )}

      {/* Credentials form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
          leftIcon={<Mail className="h-3.5 w-3.5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-text-muted font-mono">
              Password
            </label>
            {/* Placeholder — no forgot-password endpoint in Phase 1 */}
            <span className="text-[12px] text-text-dim font-mono cursor-not-allowed">
              Forgot password?
            </span>
          </div>

          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            leftIcon={<Lock className="h-3.5 w-3.5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-text-dim hover:text-text-muted transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword
                  ? <EyeOff className="h-3.5 w-3.5" />
                  : <Eye    className="h-3.5 w-3.5" />
                }
              </button>
            }
            error={errors.password?.message}
            withWrapper={false}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-[11px] text-ra-red font-mono">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="full"
          loading={isSubmitting}
          className="mt-2"
        >
          Sign in →
        </Button>
      </form>

      <p className="text-[11px] text-text-dim text-center leading-relaxed">
        By signing in you agree to our terms of service and privacy policy.
      </p>
    </div>
  )
}
