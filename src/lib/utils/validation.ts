import { z } from 'zod'

/**
 * Login form schema — mirrors the NestJS LoginDto validators:
 * @IsEmail() + @IsString()
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

/**
 * Register form schema — mirrors the NestJS RegisterDto validators:
 * @IsEmail() + @IsString() + @MinLength(8) + @MaxLength(72)
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(8,  'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path:    ['confirmPassword'],
  },
)

export type RegisterFormValues = z.infer<typeof registerSchema>
