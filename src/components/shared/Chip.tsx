import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Chip({
  children,
  tone = 'default',
  className,
  ...props
}: {
  children: ReactNode
  tone?: 'default' | 'purple' | 'muted'
} & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs',
        tone === 'purple'
          ? 'bg-brand-purple/10 border-brand-purple/20 text-brand-purpleLight'
          : tone === 'muted'
            ? 'bg-white/[0.02] border-white/[0.06] text-text-muted'
            : 'bg-white/[0.04] border-white/[0.08] text-text-secondary',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
