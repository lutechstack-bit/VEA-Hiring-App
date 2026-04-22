import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSavedJobs, useSavedJobIds, useToggleSavedJob } from '@/hooks/useSavedJobs'
import { useProfile } from '@/hooks/useProfile'
import { useMyApplications } from '@/hooks/useApplications'
import { JobCard } from '@/components/jobs/JobCard'
import { ListSkeleton } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'

export function SavedJobs() {
  const { user } = useAuth()
  const { data, isLoading } = useSavedJobs(user?.id)
  const { data: savedIds } = useSavedJobIds(user?.id)
  const { data: profile } = useProfile(user?.id)
  const { data: apps } = useMyApplications(user?.id)
  const toggleSaved = useToggleSavedJob()
  const appliedIds = new Set((apps ?? []).map((a) => a.job_id))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Your list"
        title="Saved jobs"
        description="Jobs you\u2019ve bookmarked for later. Unsave any time."
      />
      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : data && data.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {data.map((s) => (
            <JobCard
              key={s.id}
              job={s.job}
              profile={profile ?? null}
              hasApplied={appliedIds.has(s.job.id)}
              saved={savedIds?.has(s.job.id) ?? true}
              onToggleSaved={
                user
                  ? () =>
                      toggleSaved.mutate({
                        editorId: user.id,
                        jobId: s.job.id,
                        saved: true,
                      })
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Bookmark any role on the jobs page to come back to it later."
          action={
            <Link to="/jobs" className="text-sm text-brand-purpleLight hover:underline">
              Browse jobs →
            </Link>
          }
        />
      )}
    </div>
  )
}
