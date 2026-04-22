import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  padded?: boolean
  size?: 'default' | 'hero'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { hoverable = true, padded = true, size = 'default', className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-background-secondary border border-white/[0.06]',
        size === 'hero' ? 'rounded-2xl' : 'rounded-xl',
        padded && (size === 'hero' ? 'p-8' : 'p-6'),
        hoverable &&
          'transition-all duration-300 hover:border-brand-purple/30 hover:shadow-glow-md',
        className,
      )}
      {...props}
    />
  )
})
