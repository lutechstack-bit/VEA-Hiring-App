import { useMemo, useState } from 'react'
import { MessageSquare, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useApplicants, useUpdateApplicationStatus } from '@/hooks/useApplications'
import { useToast } from '@/hooks/useToast'
import type { ApplicationStatus } from '@/lib/types'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/shared/Card'
import { Avatar } from '@/components/shared/Avatar'
import { StatusPill } from '@/components/shared/StatusPill'
import { GradientButton } from '@/components/shared/GradientButton'
import { ListSkeleton } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Select } from '@/components/ui/select'
import { threadIdFor } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const STATUSES: ApplicationStatus[] = ['Applied', 'Shortlisted', 'Hired', 'Rejected']

export function ApplicantsView() {
  const { user } = useAuth()
  const { data, isLoading } = useApplicants(user?.id)
  const navigate = useNavigate()
  const update = useUpdateApplicationStatus()
  const toast = useToast()

  const [statusFilter, setStatusFilter] = useState<'' | ApplicationStatus>('')
  const [jobFilter, setJobFilter] = useState('')

  const jobs = useMemo(() => {
    const map = new Map<string, { id: string; title: string }>()
    ;(data ?? []).forEach((a) =>
      map.set(a.job.id, { id: a.job.id, title: a.job.title }),
    )
    return Array.from(map.values())
  }, [data])

  const rows = (data ?? []).filter(
    (a) =>
      (!statusFilter || a.status === statusFilter) &&
      (!jobFilter || a.job.id === jobFilter),
  )

  const changeStatus = async (id: string, next: ApplicationStatus) => {
    try {
      await update.mutateAsync({ id, status: next })
      toast.success(`Marked as ${next}`)
    } catch (err) {
      toast.error('Could not update', err instanceof Error ? err.message : undefined)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Review"
        title="Applicants"
        description="All applications across your postings, in one place."
      />

      <div className="grid gap-2 sm:grid-cols-3">
        <Select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}>
          <option value="">All postings</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as ApplicationStatus | '')
          }
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : rows.length > 0 ? (
        <div className="grid gap-3">
          {rows.map((a) => (
            <Card key={a.id} hoverable={false}>
              <div className="flex flex-wrap items-start gap-4">
                <Avatar name={a.editor.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.editor.name}</p>
                  <p className="text-[11px] uppercase tracking-wider text-text-muted">
                    Applied to · {a.job.title}
                  </p>
                  {a.profile?.skills?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {a.profile.skills.slice(0, 6).map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[11px] text-text-secondary"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {a.note ? (
                    <p className="mt-3 rounded-lg border border-white/[0.06] bg-background-tertiary/50 p-3 text-xs text-text-secondary">
                      {a.note}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <StatusPill
                    tone={
                      a.status === 'Hired'
                        ? 'success'
                        : a.status === 'Rejected'
                          ? 'danger'
                          : 'info'
                    }
                  >
                    {a.status}
                  </StatusPill>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {STATUSES.filter((s) => s !== a.status).map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(a.id, s)}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                      s === 'Hired'
                        ? 'border-status-success/30 text-status-success hover:bg-status-successBg'
                        : s === 'Rejected'
                          ? 'border-status-danger/30 text-status-danger hover:bg-status-dangerBg'
                          : 'border-brand-purple/30 text-brand-purpleLight hover:bg-brand-purple/10',
                    )}
                  >
                    Mark as {s}
                  </button>
                ))}
                <GradientButton
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    user && navigate(`/messages/${threadIdFor(user.id, a.editor.id)}`)
                  }
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Message
                </GradientButton>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No applicants yet"
          description="Once your posting is approved, editors will start applying."
        />
      )}
    </div>
  )
}
