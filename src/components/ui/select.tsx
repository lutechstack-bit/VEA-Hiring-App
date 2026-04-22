import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        'w-full appearance-none rounded-lg border border-white/[0.08] bg-background-tertiary px-4 py-2.5 pr-10 text-sm text-text-primary outline-none transition-colors focus:border-brand-purple/60',
        'bg-[right_0.75rem_center] bg-no-repeat',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
      }}
      {...props}
    >
      {children}
    </select>
  )
})
