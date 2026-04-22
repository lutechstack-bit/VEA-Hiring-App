import { Link } from 'react-router-dom'
import { FileSearch } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMyApplications } from '@/hooks/useApplications'
import type { ApplicationStatus } from '@/lib/types'
import { Card } from '@/components/shared/Card'
import { StatusPill } from '@/components/shared/StatusPill'
import { EmptyState } from '@/components/shared/EmptyState'
import { ListSkeleton } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/layout/PageHeader'
import { timeAgo } from '@/lib/utils'

const toneFor: Record<ApplicationStatus, 'neutral' | 'info' | 'success' | 'danger'> = {
  Applied: 'info',
  Shortlisted: 'info',
  Hired: 'success',
  Rejected: 'danger',
}

export function MyApplications() {
  const { user } = useAuth()
  const { data, isLoading } = useMyApplications(user?.id)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Track"
        title="My applications"
        description="Keep an eye on your open conversations and next steps."
      />
      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((a) => (
            <Link key={a.id} to={`/jobs/${a.job.id}`}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-text-muted">
                      {a.job.company}
                    </p>
                    <h3 className="mt-1 text-base font-medium">{a.job.title}</h3>
                    <p className="mt-1 text-xs text-text-secondary">
                      {a.job.location} · {a.job.work_mode} · {a.job.experience}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
                    <StatusPill tone={toneFor[a.status]}>{a.status}</StatusPill>
                    <span className="text-[11px] text-text-muted">
                      Applied {timeAgo(a.created_at)}
                    </span>
                  </div>
                </div>
                {a.note ? (
                  <p className="mt-3 rounded-lg border border-white/[0.06] bg-background-tertiary/50 p-3 text-xs text-text-secondary">
                    {a.note}
                  </p>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileSearch}
          title="No applications yet"
          description="Browse open roles and apply to ones that fit your style."
          action={
            <Link
              to="/jobs"
              className="text-sm text-brand-purpleLight hover:underline"
            >
              Browse jobs →
            </Link>
          }
        />
      )}
    </div>
  )
}
