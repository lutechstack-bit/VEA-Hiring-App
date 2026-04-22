import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'

export function QualificationsMatch({
  jobQualifications,
  editorQualifications,
}: {
  jobQualifications: string[]
  editorQualifications: string[]
}) {
  if (jobQualifications.length === 0) return null

  const editorSet = new Set(editorQualifications.map((q) => q.toLowerCase()))

  return (
    <section className="rounded-xl border border-white/[0.06] bg-background-secondary p-6">
      <EyebrowLabel>Match</EyebrowLabel>
      <h3 className="mt-1 text-base font-medium">Your qualifications for this job</h3>
      <ul className="mt-4 space-y-2">
        {jobQualifications.map((q) => {
          const has = editorSet.has(q.toLowerCase())
          return (
            <li
              key={q}
              className={cn(
                'flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm',
                has
                  ? 'border-status-success/30 bg-status-successBg text-text-primary'
                  : 'border-white/[0.06] bg-background-tertiary/50 text-text-secondary',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full',
                  has ? 'bg-status-success/20 text-status-success' : 'bg-white/[0.05] text-text-muted',
                )}
              >
                {has ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              </span>
              {q}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
