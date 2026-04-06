import { cva, type VariantProps } from 'class-variance-authority'
import { cn }                      from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono font-medium tracking-[0.06em] uppercase',
  {
    variants: {
      variant: {
        green:  'bg-accent/10 text-accent border border-accent/25',
        amber:  'bg-ra-amber-dim text-ra-amber border border-ra-amber/30',
        red:    'bg-ra-red-dim text-ra-red border border-ra-red/30',
        blue:   'bg-ra-blue-dim text-ra-blue border border-ra-blue/25',
        muted:  'bg-bg-surface2 text-text-muted border border-border',
        ghost:  'bg-transparent text-text-dim border border-border',
      },
    },
    defaultVariants: { variant: 'muted' },
  },
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  )
}
