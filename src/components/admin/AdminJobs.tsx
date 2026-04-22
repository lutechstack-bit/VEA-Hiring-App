import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
  useAdminApproveJob,
  useAdminJobs,
} from '@/hooks/useAdmin'
import { useDeleteJob } from '@/hooks/useJobs'
import { useToast } from '@/hooks/useToast'
import type { JobStatus } from '@/lib/types'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/shared/Card'
import { StatusPill } from '@/components/shared/StatusPill'
import { GradientButton } from '@/components/shared/GradientButton'
import { ListSkeleton } from '@/components/shared/LoadingSpinner'
import { Select } from '@/components/ui/select'
import { timeAgo } from '@/lib/utils'

export function AdminJobs() {
  const { data, isLoading } = useAdminJobs()
  const approve = useAdminApproveJob()
  const del = useDeleteJob()
  const toast = useToast()
  const [filter, setFilter] = useState<'' | JobStatus>('')

  const rows = (data ?? []).filter((j) => !filter || j.status === filter)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Jobs & gigs"
        description="Review, approve, or delete postings. Only approved postings are public."
      />
      <div className="max-w-xs">
        <Select value={filter} onChange={(e) => setFilter(e.target.value as JobStatus | '')}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>

      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : (
        <div className="space-y-3">
          {rows.map((j) => (
            <Card key={j.id} hoverable={false}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] uppercase tracking-wider text-text-muted">
                      {j.type === 'job' ? 'Job' : 'Gig'}
                    </p>
                    <StatusPill
                      tone={
                        j.status === 'approved'
                          ? 'success'
                          : j.status === 'rejected'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {j.status}
                    </StatusPill>
                  </div>
                  <h3 className="mt-1 text-base font-medium">{j.title}</h3>
                  <p className="mt-1 text-xs text-text-secondary">
                    {j.company} · Posted by {j.poster?.name ?? '—'} · {timeAgo(j.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {j.status !== 'approved' ? (
                    <GradientButton
                      size="sm"
                      onClick={async () => {
                        try {
                          await approve.mutateAsync({ id: j.id, status: 'approved' })
                          toast.success('Approved')
                        } catch (err) {
                          toast.error(
                            'Could not approve',
                            err instanceof Error ? err.message : undefined,
                          )
                        }
                      }}
                    >
                      Approve
                    </GradientButton>
                  ) : null}
                  {j.status !== 'rejected' ? (
                    <GradientButton
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        try {
                          await approve.mutateAsync({ id: j.id, status: 'rejected' })
                          toast.success('Rejected')
                        } catch (err) {
                          toast.error(
                            'Could not reject',
                            err instanceof Error ? err.message : undefined,
                          )
                        }
                      }}
                    >
                      Reject
                    </GradientButton>
                  ) : null}
                  <button
                    onClick={async () => {
                      if (!confirm('Delete this job? This cannot be undone.')) return
                      try {
                        await del.mutateAsync(j.id)
                        toast.success('Deleted')
                      } catch (err) {
                        toast.error(
                          'Could not delete',
                          err instanceof Error ? err.message : undefined,
                        )
                      }
                    }}
                    className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-white/[0.05] hover:text-status-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 whitespace-pre-wrap text-sm text-text-secondary">
                {j.description}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
