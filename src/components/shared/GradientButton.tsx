import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  function GradientButton(
    { variant = 'gradient', size = 'md', loading = false, className, children, disabled, ...props },
    ref,
  ) {
    const base =
      'relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap'
    const sz =
      size === 'sm'
        ? 'px-3 py-1.5 text-xs'
        : size === 'lg'
          ? 'px-6 py-3 text-base'
          : 'px-4 py-2.5 text-sm'
    const variants: Record<NonNullable<GradientButtonProps['variant']>, string> = {
      gradient:
        'bg-gradient-to-r from-brand-purple to-brand-purpleLight text-white hover:from-brand-purpleDeep hover:to-brand-purple hover:shadow-glow-sm disabled:hover:shadow-none',
      ghost:
        'bg-white/[0.03] border border-white/[0.08] text-text-primary hover:bg-white/[0.06] hover:border-brand-purple/30',
      outline:
        'bg-transparent border border-brand-purple/30 text-brand-purpleLight hover:bg-brand-purple/10',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, sz, variants[variant], className)}
        {...props}
      >
        {loading ? (
          <span
            aria-hidden
            className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"
          />
        ) : null}
        {children}
      </button>
    )
  },
)
