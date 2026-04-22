import { Check, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ProfileRow } from '@/lib/types'
import { cn } from '@/lib/utils'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'

export function ProfileCompletionChecklist({
  profile,
}: {
  profile: ProfileRow | null
}) {
  const steps = [
    {
      n: 1,
      title: 'Add your bio and core skills',
      subtitle: 'At least 50 characters of bio, plus 2+ skills tagged.',
      done:
        (profile?.bio?.length ?? 0) >= 50 && (profile?.skills?.length ?? 0) >= 2,
    },
    {
      n: 2,
      title: 'Add at least one portfolio link',
      subtitle: 'Showreel, YouTube, Vimeo, or Drive — anything reviewable.',
      done: (profile?.portfolio_links?.length ?? 0) >= 1,
    },
    {
      n: 3,
      title: 'Set your placement preferences',
      subtitle: 'Experience level and location help partners find you.',
      done: !!profile?.experience && !!profile?.location,
    },
  ]
  const allDone = steps.every((s) => s.done)
  if (allDone) return null

  return (
    <section className="rounded-xl border border-white/[0.06] bg-background-secondary p-6">
      <EyebrowLabel>Get placement-ready</EyebrowLabel>
      <h2 className="mt-1.5 text-lg font-medium">Finish setting up your profile</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Partners won\u2019t see your profile until at least the first step is complete.
      </p>
      <ul className="mt-4 space-y-2">
        {steps.map((s) => (
          <li key={s.n}>
            <Link
              to="/profile"
              className={cn(
                'group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-background-tertiary/50 p-4 transition-all hover:border-brand-purple/30 hover:bg-brand-purple/5',
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-medium',
                  s.done
                    ? 'border-status-success/40 bg-status-successBg text-status-success'
                    : 'border-brand-purple/40 bg-brand-purple/10 text-brand-purpleLight',
                )}
              >
                {s.done ? <Check className="h-4 w-4" /> : String(s.n).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{s.title}</p>
                <p className="truncate text-xs text-text-secondary">{s.subtitle}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-purpleLight" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
