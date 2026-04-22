import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-background-secondary/50 px-6 py-12 text-center',
        className,
      )}
    >
      {Icon ? (
        <div className="mb-4 rounded-full bg-brand-purple/10 p-3 text-brand-purpleLight">
          <Icon className="h-6 w-6" />
        </div>
      ) : null}
      <p className="text-sm font-medium text-text-primary">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-xs text-text-secondary">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
