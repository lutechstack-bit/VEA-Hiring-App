import { Link } from 'react-router-dom'
import {
  Bookmark,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { useMyApplications } from '@/hooks/useApplications'
import { useSavedJobs } from '@/hooks/useSavedJobs'
import { useJobs } from '@/hooks/useJobs'
import { MetricCard } from '@/components/shared/MetricCard'
import { PlacementReadinessBar } from './PlacementReadinessBar'
import { ProfileCompletionChecklist } from './ProfileCompletionChecklist'
import { JumpBackIn } from './JumpBackIn'
import { PageHeader } from '@/components/layout/PageHeader'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'
import { Card } from '@/components/shared/Card'
import { timeAgo } from '@/lib/utils'

export function EditorDashboard() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id)
  const { data: apps } = useMyApplications(user?.id)
  const { data: saved } = useSavedJobs(user?.id)
  const { data: openJobs } = useJobs({})

  const shortlisted = apps?.filter((a) => a.status === 'Shortlisted').length ?? 0
  const totalApps = apps?.length ?? 0
  const savedCount = saved?.length ?? 0
  const jobsCount = openJobs?.filter((j) => j.type === 'job').length ?? 0
  const gigsCount = openJobs?.filter((j) => j.type === 'gig').length ?? 0

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your dashboard"
        title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'editor'}`}
        description="Track your applications, keep your profile sharp, and find your next gig."
      />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <MetricCard label="Active jobs" value={jobsCount} icon={Briefcase} />
        <MetricCard label="Open gigs" value={gigsCount} icon={Zap} />
        <MetricCard label="Applications" value={totalApps} icon={ClipboardList} />
        <MetricCard
          label="Shortlisted"
          value={shortlisted}
          icon={CheckCircle2}
          hint={shortlisted > 0 ? 'Partners liked your work' : undefined}
        />
      </div>

      <PlacementReadinessBar profile={profile ?? null} />

      <ProfileCompletionChecklist profile={profile ?? null} />

      <div className="grid gap-5 md:grid-cols-2">
        <JumpBackIn profile={profile ?? null} />

        <Link
          to="/saved"
          className="group relative block overflow-hidden rounded-xl border border-white/[0.06] bg-background-secondary p-6 transition-all duration-300 hover:border-brand-purple/30 hover:shadow-glow-md"
        >
          <EyebrowLabel>Saved jobs</EyebrowLabel>
          <div className="mt-2 flex items-end gap-3">
            <p className="text-3xl font-medium tabular-nums">{savedCount}</p>
            <p className="pb-1 text-sm text-text-secondary">
              {savedCount === 1 ? 'job saved' : 'jobs saved'}
            </p>
          </div>
          <div className="mt-3 inline-flex items-center gap-1 text-sm text-brand-purpleLight">
            <Bookmark className="h-4 w-4" /> View saved list
          </div>
        </Link>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <EyebrowLabel>Latest openings</EyebrowLabel>
            <h2 className="mt-1 text-lg font-medium">Recently posted</h2>
          </div>
          <Link
            to="/jobs"
            className="text-sm text-brand-purpleLight hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {(openJobs ?? []).slice(0, 4).map((j) => (
            <Link key={j.id} to={`/jobs/${j.id}`}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-text-muted">{j.company}</p>
                    <p className="mt-1 text-sm font-medium">{j.title}</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {j.location} · {j.work_mode} · {j.experience}
                    </p>
                  </div>
                  <p className="shrink-0 text-[11px] text-text-muted">
                    {timeAgo(j.created_at)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
