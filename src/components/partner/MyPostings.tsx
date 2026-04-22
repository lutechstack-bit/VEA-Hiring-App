import { Link } from 'react-router-dom'
import { Plus, FileText, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useDeleteJob, useMyPostings } from '@/hooks/useJobs'
import { useToast } from '@/hooks/useToast'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/shared/Card'
import { StatusPill } from '@/components/shared/StatusPill'
import { ListSkeleton } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { GradientButton } from '@/components/shared/GradientButton'
import { timeAgo } from '@/lib/utils'

export function MyPostings() {
  const { user } = useAuth()
  const { data, isLoading } = useMyPostings(user?.id)
  const del = useDeleteJob()
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Your roles"
        title="My postings"
        description="Everything you\u2019ve posted. Pending items are awaiting admin review."
        actions={
          <Link to="/postings/new">
            <GradientButton size="sm">
              <Plus className="h-4 w-4" /> New posting
            </GradientButton>
          </Link>
        }
      />

      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : data && data.length > 0 ? (
        <div className="grid gap-3">
          {data.map((j) => (
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
                    {j.location} · {j.work_mode} · {j.budget}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[11px] text-text-muted">
                    {timeAgo(j.created_at)}
                  </span>
                  <button
                    onClick={async () => {
                      if (!confirm('Delete this posting? This cannot be undone.')) return
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
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No postings yet"
          description="Post your first role — an admin will approve it within a day."
          action={
            <Link to="/postings/new">
              <GradientButton size="sm">
                <Plus className="h-4 w-4" /> Create posting
              </GradientButton>
            </Link>
          }
        />
      )}
    </div>
  )
}
