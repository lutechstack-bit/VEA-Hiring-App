import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MetricCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: {
  label: string
  value: string | number
  icon?: LucideIcon
  hint?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-white/[0.06] bg-background-secondary p-6 transition-all duration-300 hover:border-brand-purple/30 hover:shadow-glow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted">
            {label}
          </p>
          <p className="mt-2 text-3xl font-medium text-text-primary">{value}</p>
          {hint ? (
            <p className="mt-1 text-xs text-text-secondary">{hint}</p>
          ) : null}
        </div>
        {Icon ? (
          <div className="rounded-lg bg-brand-purple/10 p-2 text-brand-purpleLight transition-colors group-hover:bg-brand-purple/20">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-purple/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
      />
    </div>
  )
}
