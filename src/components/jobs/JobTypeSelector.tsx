import { Check } from 'lucide-react'
import { EMPLOYMENT_TYPES, EMPLOYMENT_TYPE_HINTS } from '@/lib/constants'
import type { EmploymentType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Sheet } from '@/components/ui/sheet'

export function JobTypeSelector({
  open,
  onClose,
  value,
  onChange,
}: {
  open: boolean
  onClose: () => void
  value: EmploymentType | null
  onChange: (v: EmploymentType) => void
}) {
  return (
    <Sheet open={open} onClose={onClose} side="bottom" title="Employment type">
      <ul className="divide-y divide-white/[0.06]">
        {EMPLOYMENT_TYPES.map((t) => {
          const selected = value === t
          return (
            <li key={t}>
              <button
                type="button"
                onClick={() => {
                  onChange(t)
                  onClose()
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-4 py-3.5 text-left transition-colors',
                  selected ? 'text-brand-purpleLight' : 'text-text-primary',
                )}
              >
                <div>
                  <p className="font-medium">{t}</p>
                  <p className="text-xs text-text-muted">
                    {EMPLOYMENT_TYPE_HINTS[t]}
                  </p>
                </div>
                {selected ? <Check className="h-4 w-4" /> : null}
              </button>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
}
