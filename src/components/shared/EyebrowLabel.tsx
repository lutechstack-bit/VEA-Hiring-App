import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function EyebrowLabel({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted',
        className,
      )}
      {...props}
    />
  )
}
