import { useState } from 'react'
import { Search } from 'lucide-react'
import type { JobType } from '@/lib/types'
import { useJobs } from '@/hooks/useJobs'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { useMyApplications } from '@/hooks/useApplications'
import { useSavedJobIds, useToggleSavedJob } from '@/hooks/useSavedJobs'
import { JobCard } from './JobCard'
import { JobFilters, type JobFilterState } from './JobFilters'
import { ListSkeleton } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'

export function JobsList({ type }: { type: JobType }) {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id)
  const { data: apps } = useMyApplications(user?.id)
  const { data: savedIds } = useSavedJobIds(user?.id)
  const toggleSaved = useToggleSavedJob()

  const [filters, setFilters] = useState<JobFilterState>({
    search: '',
    skill: '',
    experience: '',
    workMode: '',
    employmentType: '',
  })

  const { data: jobs, isLoading } = useJobs({
    type,
    search: filters.search,
    skill: filters.skill || undefined,
    experience: filters.experience || undefined,
    workMode: filters.workMode || undefined,
    employmentType: filters.employmentType || undefined,
  })

  const appliedIds = new Set((apps ?? []).map((a) => a.job_id))

  return (
    <div className="space-y-4">
      <JobFilters value={filters} onChange={setFilters} showEmploymentType={type === 'job'} />

      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : jobs && jobs.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {jobs.map((j) => (
            <JobCard
              key={j.id}
              job={j}
              profile={profile ?? null}
              hasApplied={appliedIds.has(j.id)}
              saved={savedIds?.has(j.id) ?? false}
              onToggleSaved={
                user
                  ? () =>
                      toggleSaved.mutate({
                        editorId: user.id,
                        jobId: j.id,
                        saved: savedIds?.has(j.id) ?? false,
                      })
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No results match your filters"
          description="Try a broader search or clear the filters to see everything."
        />
      )}
    </div>
  )
}
