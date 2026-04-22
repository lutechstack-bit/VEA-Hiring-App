import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, MapPin, Wallet } from 'lucide-react'
import type { JobRow, ProfileRow } from '@/lib/types'
import { Card } from '@/components/shared/Card'
import { Avatar } from '@/components/shared/Avatar'
import { StatusPill } from '@/components/shared/StatusPill'
import { EasyApplyBadge } from './EasyApplyBadge'
import { cn, matchPercent, timeAgo } from '@/lib/utils'

export function JobCard({
  job,
  profile,
  hasApplied,
  saved,
  onToggleSaved,
}: {
  job: JobRow
  profile?: ProfileRow | null
  hasApplied?: boolean
  saved?: boolean
  onToggleSaved?: () => void
}) {
  const matches = profile ? matchPercent(profile.skills, job.skills) : 0
  const easyApply = matches >= 50

  return (
    <div className="relative">
      <Link to={`/jobs/${job.id}`} className="block">
        <Card className="relative">
          <div className="flex items-start gap-4">
            <Avatar name={job.company} size="md" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] uppercase tracking-wider text-text-muted">
                  {job.company}
                </p>
                {job.employment_type ? (
                  <span className="text-[11px] text-text-muted">
                    · {job.employment_type}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-1 text-base font-medium text-text-primary">
                {job.title}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {job.location}
                </span>
                <span>· {job.work_mode}</span>
                <span>· {job.experience}</span>
                <span className="inline-flex items-center gap-1">
                  <Wallet className="h-3 w-3" /> {job.budget}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.skills.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 text-[11px]',
                      profile?.skills
                        .map((x) => x.toLowerCase())
                        .includes(s.toLowerCase())
                        ? 'border-brand-purple/30 bg-brand-purple/10 text-brand-purpleLight'
                        : 'border-white/[0.06] bg-white/[0.02] text-text-secondary',
                    )}
                  >
                    {s}
                  </span>
                ))}
                {job.skills.length > 4 ? (
                  <span className="rounded-full border border-white/[0.06] px-2.5 py-0.5 text-[11px] text-text-muted">
                    +{job.skills.length - 4}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {easyApply ? <EasyApplyBadge /> : null}
                  {hasApplied ? (
                    <StatusPill tone="success">Applied</StatusPill>
                  ) : null}
                </div>
                <p className="text-[11px] text-text-muted">{timeAgo(job.created_at)}</p>
              </div>
            </div>
          </div>
        </Card>
      </Link>
      {onToggleSaved ? (
        <button
          onClick={(e) => {
            e.preventDefault()
            onToggleSaved()
          }}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/[0.05] hover:text-brand-purpleLight"
          aria-label={saved ? 'Unsave job' : 'Save job'}
        >
          {saved ? (
            <BookmarkCheck className="h-4 w-4 text-brand-purpleLight" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      ) : null}
    </div>
  )
}
