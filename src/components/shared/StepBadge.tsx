import { cn } from '@/lib/utils'

export function StepBadge({
  n,
  label,
  className,
}: {
  n: number | string
  label?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-brand-purple/20 bg-brand-purple/10 px-3 py-1 text-xs text-brand-purpleLight',
        className,
      )}
    >
      <span className="tracking-wider">
        Step {typeof n === 'number' ? String(n).padStart(2, '0') : n}
      </span>
      {label ? <span className="text-text-secondary">· {label}</span> : null}
    </span>
  )
}
