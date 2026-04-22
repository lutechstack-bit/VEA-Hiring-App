import { Check } from 'lucide-react'
import type { ProfileRow } from '@/lib/types'
import { cn } from '@/lib/utils'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'

interface Milestone {
  id: string
  label: string
  done: boolean
}

export function PlacementReadinessBar({ profile }: { profile: ProfileRow | null }) {
  const milestones: Milestone[] = [
    {
      id: 'profile',
      label: 'Profile complete',
      done: !!profile?.bio && !!profile?.location && !!profile?.experience,
    },
    {
      id: 'portfolio',
      label: 'Portfolio added',
      done: (profile?.portfolio_links?.length ?? 0) >= 1,
    },
    {
      id: 'skills',
      label: 'Skills tagged',
      done: (profile?.skills?.length ?? 0) >= 3,
    },
    {
      id: 'verified',
      label: 'Admin verified',
      done: profile?.tags?.includes('Verified') ?? false,
    },
  ]
  const done = milestones.filter((m) => m.done).length
  const pct = (done / milestones.length) * 100

  return (
    <div className="rounded-xl border border-white/[0.06] bg-background-secondary p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <EyebrowLabel>Placement readiness</EyebrowLabel>
          <p className="mt-1 text-sm text-text-primary">
            {done} of {milestones.length} complete
          </p>
        </div>
        <p className="text-2xl font-medium tabular-nums text-text-primary">
          {Math.round(pct)}%
        </p>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-purpleLight transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {milestones.map((m) => (
          <li key={m.id} className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                'flex h-4 w-4 items-center justify-center rounded-full border',
                m.done
                  ? 'border-status-success/40 bg-status-successBg text-status-success'
                  : 'border-white/[0.08] text-text-muted',
              )}
            >
              {m.done ? <Check className="h-2.5 w-2.5" /> : null}
            </span>
            <span className={m.done ? 'text-text-secondary' : 'text-text-muted'}>
              {m.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
