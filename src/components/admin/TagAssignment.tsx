import { Check } from 'lucide-react'
import type { Tag } from '@/lib/types'
import { TAG_LIST, TAG_STYLES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function TagAssignment({
  value,
  onChange,
}: {
  value: Tag[]
  onChange: (next: Tag[]) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {TAG_LIST.map((t) => {
        const active = value.includes(t)
        return (
          <button
            key={t}
            onClick={() =>
              onChange(active ? value.filter((x) => x !== t) : [...value, t])
            }
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs transition-all',
              active
                ? TAG_STYLES[t]
                : 'border-white/[0.08] bg-background-tertiary text-text-secondary hover:border-brand-purple/30',
            )}
          >
            {active ? <Check className="mr-1 inline h-3 w-3" /> : null}
            {t}
          </button>
        )
      })}
    </div>
  )
}
