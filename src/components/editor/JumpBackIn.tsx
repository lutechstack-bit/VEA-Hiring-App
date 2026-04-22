import { ArrowRight, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'
import type { ProfileRow } from '@/lib/types'
import { Chip } from '@/components/shared/Chip'

export function JumpBackIn({ profile }: { profile: ProfileRow | null }) {
  const top = (profile?.skills ?? []).slice(0, 3)
  return (
    <Link
      to="/jobs"
      className="group relative block overflow-hidden rounded-xl border border-white/[0.06] bg-background-secondary p-6 transition-all duration-300 hover:border-brand-purple/30 hover:shadow-glow-md"
    >
      <div
        aria-hidden
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-purple/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <EyebrowLabel>Jump back in</EyebrowLabel>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-medium">Continue your job search</p>
          <p className="mt-1 text-sm text-text-secondary">
            {top.length
              ? `Pick up where you left off. Filters: ${top.join(' · ')}`
              : 'Explore the latest openings from verified partners.'}
          </p>
          {top.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {top.map((s) => (
                <Chip key={s} tone="purple">
                  {s}
                </Chip>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-sm text-brand-purpleLight">
          <Briefcase className="h-4 w-4" />
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
