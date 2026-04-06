'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 }                 from 'lucide-react'
import { forwardRef }              from 'react'
import { cn }                      from '@/lib/utils/cn'

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'font-mono text-[12px] font-medium tracking-[0.04em]',
    'rounded-md border transition-all duration-150',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
    'select-none',
  ],
  {
    variants: {
      variant: {
        /** Filled accent — primary CTA */
        accent: [
          'bg-accent text-black border-transparent',
          'hover:bg-accent/90 active:scale-[0.98]',
        ],
        /** Ghost outline — secondary actions */
        ghost: [
          'bg-transparent text-text-muted border-border-2',
          'hover:bg-bg-surface2 hover:text-text active:scale-[0.98]',
        ],
        /** Destructive — danger actions */
        danger: [
          'bg-transparent text-ra-red border-ra-red/30',
          'hover:bg-ra-red/10 active:scale-[0.98]',
        ],
        /** GitHub — OAuth button */
        github: [
          'bg-[#238636] text-white border-transparent',
          'hover:bg-[#2ea043] active:scale-[0.98]',
        ],
        /** Link — looks like a text link */
        link: [
          'bg-transparent border-transparent text-accent underline-offset-4',
          'hover:underline p-0 h-auto',
        ],
      },
      size: {
        sm:   'h-7  px-3 text-[11px]',
        md:   'h-9  px-4 text-[12px]',
        lg:   'h-10 px-5 text-[13px]',
        full: 'h-10 px-5 text-[13px] w-full',
        icon: 'h-8  w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'accent',
      size:    'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  ),
)

Button.displayName = 'Button'

export { Button, buttonVariants }
