import { BadgeCheck, Sparkles, TrendingUp } from 'lucide-react'
import type { Tag } from '@/lib/types'
import { cn } from '@/lib/utils'
import { TAG_STYLES } from '@/lib/constants'

const icons: Record<Tag, typeof BadgeCheck> = {
  Verified: BadgeCheck,
  'Top Performer': TrendingUp,
  'Placement Ready': Sparkles,
}

export function TagPill({ tag, className }: { tag: Tag; className?: string }) {
  const Icon = icons[tag]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
        TAG_STYLES[tag],
        className,
      )}
      title={`${tag} — assigned by admin`}
    >
      <Icon className="h-3 w-3" />
      {tag}
    </span>
  )
}
