import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EasyApplyBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-brand-purple/30 bg-brand-purple/10 px-2.5 py-1 text-[11px] font-medium text-brand-purpleLight',
        className,
      )}
      title="Your skills match this job — easy apply."
    >
      <Zap className="h-3 w-3" />
      Easy Apply
    </span>
  )
}
