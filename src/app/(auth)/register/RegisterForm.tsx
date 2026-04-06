'use client'

import { useState }    from 'react'
import { useForm }     from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn }      from 'next-auth/react'
import { useRouter }   from 'next/navigation'
import Link            from 'next/link'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { toast }       from 'sonner'

import { Button }  from '@/components/ui/button'
import { Input }   from '@/components/ui/input'
import { registerSchema, type RegisterFormValues } from '@/lib/utils/validation'
import { registerUser } from '@/lib/api/auth.api'
import { ApiError }     from '@/lib/api/client'

/**
 * RegisterForm — fully client-side.
 *
 * Flow:
 * 1. Validate form locally with zod.
 * 2. Call POST /auth/register directly (via our API wrapper).
 *    We skip NextAuth here because NextAuth's `signIn` only supports
 *    credentials that go through the authorize callback (which calls /login).
 * 3. On success, immediately call signIn('credentials') to create the session.
 * 4. Redirect to /dashboard.
 *
 * Why call the API directly instead of a Server Action?
 * The NestJS backend already validates and creates the user.
 * A Server Action would be an extra round-trip with no benefit for this flow.
 */
export default function RegisterForm() {
  const router = useRouter()

  const [showPassword,        setShowPassword]        = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver:      zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      // Step 1: Register with the backend
      await registerUser({
        email:    values.email,
        password: values.password,
      })

      // Step 2: Auto-sign in with NextAuth credentials
      const result = await signIn('credentials', {
        email:    values.email,
        password: values.password,
        redirect: false,
      })

      if (!result || result.error) {
        // Registration succeeded but login failed — send to login page
        toast.success('Account created! Please sign in.')
        router.push('/login')
        return
      }

      toast.success('Account created! Welcome to Repo Analyzer.')
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.isConflict) {
          toast.error('An account with this email already exists.')
          return
        }
        if (err.isBadRequest) {
          toast.error(
            typeof err.message === 'string'
              ? err.message
              : 'Please check your inputs and try again.',
          )
          return
        }
      }
      toast.error('Something went wrong. Please try again.')
      console.error('[RegisterForm] error:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-text mb-1">Create an account</h1>
        <p className="text-[13px] text-text-muted">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-accent hover:underline underline-offset-4 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Form */}
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

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-text-muted font-mono">
            Password
          </label>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
            autoComplete="new-password"
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
            withWrapper={false}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-[11px] text-ra-red font-mono">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-text-muted font-mono">
            Confirm password
          </label>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            autoComplete="new-password"
            leftIcon={<Lock className="h-3.5 w-3.5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="text-text-dim hover:text-text-muted transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword
                  ? <EyeOff className="h-3.5 w-3.5" />
                  : <Eye    className="h-3.5 w-3.5" />
                }
              </button>
            }
            withWrapper={false}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-[11px] text-ra-red font-mono">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Password requirements hint */}
        <p className="text-[11px] text-text-dim font-mono">
          Must be 8–72 characters. Use a mix of letters, numbers, and symbols.
        </p>

        <Button
          type="submit"
          size="full"
          loading={isSubmitting}
          className="mt-2"
        >
          Create account →
        </Button>
      </form>

      <p className="text-[11px] text-text-dim text-center leading-relaxed">
        By creating an account you agree to our terms of service and privacy policy.
      </p>
    </div>
  )
}
