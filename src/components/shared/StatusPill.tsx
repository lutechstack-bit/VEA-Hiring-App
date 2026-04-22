import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

export interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-white/[0.05] border-white/10 text-text-secondary',
  success:
    'bg-status-successBg border-status-success/30 text-status-success',
  warning:
    'bg-status-warningBg border-status-warning/30 text-status-warning',
  danger: 'bg-status-dangerBg border-status-danger/30 text-status-danger',
  info: 'bg-status-infoBg border-status-info/30 text-brand-purpleLight',
  purple:
    'bg-brand-purple/10 border-brand-purple/30 text-brand-purpleLight',
}

export function StatusPill({
  tone = 'neutral',
  className,
  children,
  ...props
}: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
