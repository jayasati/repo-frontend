'use client'

import { forwardRef }     from 'react'
import type { ReactNode } from 'react'
import { cn }             from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:      string
  error?:      string
  hint?:       string
  leftIcon?:   ReactNode
  rightIcon?:  ReactNode
  /** Wrap in a container div with label + error. Defaults to true. */
  withWrapper?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      withWrapper = true,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    const inputEl = (
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-dim">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            // Base
            'w-full rounded-lg bg-bg-surface2 border text-text text-[13px] font-mono',
            'placeholder:text-text-dim caret-accent',
            'transition-colors duration-150 outline-none',
            // Padding — adjust for icons
            leftIcon  ? 'pl-9'  : 'pl-3',
            rightIcon ? 'pr-9'  : 'pr-3',
            'py-2.5',
            // Border states
            error
              ? 'border-ra-red/60 focus:border-ra-red'
              : 'border-border focus:border-border-2 hover:border-border-2',
            // Focus ring
            'focus:ring-2 focus:ring-accent/10',
            className,
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-dim">
            {rightIcon}
          </div>
        )}
      </div>
    )

    if (!withWrapper) return inputEl

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-medium text-text-muted font-mono"
          >
            {label}
          </label>
        )}

        {inputEl}

        {error && (
          <p className="text-[11px] text-ra-red font-mono">{error}</p>
        )}

        {hint && !error && (
          <p className="text-[11px] text-text-dim font-mono">{hint}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
