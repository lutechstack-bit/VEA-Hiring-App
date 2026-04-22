import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Calendar,
  MapPin,
  Wallet,
} from 'lucide-react'
import { useJob } from '@/hooks/useJobs'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { useApplyToJob, useHasApplied } from '@/hooks/useApplications'
import { useSavedJobIds, useToggleSavedJob } from '@/hooks/useSavedJobs'
import { useToast } from '@/hooks/useToast'
import { cn, formatDate, matchPercent } from '@/lib/utils'
import { GradientButton } from '@/components/shared/GradientButton'
import { StatusPill } from '@/components/shared/StatusPill'
import { Card } from '@/components/shared/Card'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'
import { QualificationsMatch } from './QualificationsMatch'
import { EasyApplyBadge } from './EasyApplyBadge'
import { Avatar } from '@/components/shared/Avatar'

export function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: job, isLoading } = useJob(id)
  const { data: profile } = useProfile(user?.id)
  const { data: existing } = useHasApplied(id ?? '', user?.id)
  const { data: savedIds } = useSavedJobIds(user?.id)
  const apply = useApplyToJob()
  const toggleSaved = useToggleSavedJob()
  const toast = useToast()

  if (isLoading) return <p className="text-sm text-text-secondary">Loading…</p>
  if (!job) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-text-secondary">That job wasn\u2019t found.</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm text-brand-purpleLight hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </Link>
      </div>
    )
  }

  const match = profile ? matchPercent(profile.skills, job.skills) : 0
  const easyApply = match >= 50
  const saved = savedIds?.has(job.id) ?? false
  const matched = new Set(
    (profile?.skills ?? []).map((s) => s.toLowerCase()),
  )
  const missingSkills = job.skills.filter(
    (s) => !matched.has(s.toLowerCase()),
  )
  const matchedSkills = job.skills.filter((s) => matched.has(s.toLowerCase()))

  const onApply = async () => {
    if (!user) return
    try {
      await apply.mutateAsync({ jobId: job.id, editorId: user.id })
      toast.success('Application sent', 'The partner can see your profile now.')
    } catch (err) {
      toast.error(
        'Could not apply',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-background-secondary p-6 sm:p-8">
        <div
          aria-hidden
          className="absolute inset-0 bg-radial-purple opacity-50"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar name={job.company} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <EyebrowLabel>{job.type === 'job' ? 'Job' : 'Gig'}</EyebrowLabel>
              {job.employment_type ? (
                <StatusPill tone="info">{job.employment_type}</StatusPill>
              ) : null}
              {easyApply && !existing ? <EasyApplyBadge /> : null}
              {existing ? (
                <StatusPill tone="success">Applied · {existing.status}</StatusPill>
              ) : null}
            </div>
            <h1 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">
              {job.title}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">{job.company}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                {job.work_mode}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="h-4 w-4" />
                {job.budget}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Posted {formatDate(job.created_at)}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {existing ? (
                <StatusPill tone="success">Application: {existing.status}</StatusPill>
              ) : (
                <GradientButton
                  size="lg"
                  onClick={onApply}
                  loading={apply.isPending}
                >
                  {easyApply ? 'Easy Apply' : 'Apply now'}
                </GradientButton>
              )}
              <GradientButton
                variant="ghost"
                onClick={() =>
                  user &&
                  toggleSaved.mutate({
                    editorId: user.id,
                    jobId: job.id,
                    saved,
                  })
                }
              >
                {saved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 text-brand-purpleLight" /> Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" /> Save
                  </>
                )}
              </GradientButton>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card size="hero">
            <EyebrowLabel>Role</EyebrowLabel>
            <h2 className="mt-1 text-lg font-medium">About this opportunity</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
              {job.description}
            </p>
          </Card>

          {job.qualifications.length > 0 ? (
            <QualificationsMatch
              jobQualifications={job.qualifications}
              editorQualifications={profile?.qualifications ?? []}
            />
          ) : null}
        </div>

        <aside className="space-y-6">
          <Card>
            <EyebrowLabel>Skills match</EyebrowLabel>
            <p className="mt-1 text-sm text-text-secondary">
              {profile
                ? `${match}% of the required skills are on your profile.`
                : 'Add skills to your profile to see your match.'}
            </p>
            {matchedSkills.length > 0 ? (
              <div className="mt-3">
                <p className="mb-1.5 text-[11px] uppercase tracking-wider text-text-muted">
                  Matched
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-brand-purple/30 bg-brand-purple/10 px-2.5 py-1 text-[11px] text-brand-purpleLight"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {missingSkills.length > 0 ? (
              <div className="mt-3">
                <p className="mb-1.5 text-[11px] uppercase tracking-wider text-text-muted">
                  Missing
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.map((s) => (
                    <span
                      key={s}
                      className={cn(
                        'rounded-full border border-white/[0.06] bg-background-tertiary px-2.5 py-1 text-[11px] text-text-secondary',
                      )}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>

          <Card>
            <EyebrowLabel>Quick facts</EyebrowLabel>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Experience" value={job.experience} />
              <Row label="Work mode" value={job.work_mode} />
              <Row label="Budget" value={job.budget} />
              {job.employment_type ? (
                <Row label="Type" value={job.employment_type} />
              ) : null}
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-xs uppercase tracking-wider text-text-muted">{label}</dt>
      <dd className="text-right text-sm text-text-primary">{value}</dd>
    </div>
  )
}
