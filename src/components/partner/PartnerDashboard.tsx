import { Link } from 'react-router-dom'
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
  Users,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMyPostings } from '@/hooks/useJobs'
import { useApplicants } from '@/hooks/useApplications'
import { PageHeader } from '@/components/layout/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'
import { Card } from '@/components/shared/Card'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'
import { GradientButton } from '@/components/shared/GradientButton'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusPill } from '@/components/shared/StatusPill'
import { Avatar } from '@/components/shared/Avatar'
import { timeAgo } from '@/lib/utils'

export function PartnerDashboard() {
  const { user } = useAuth()
  const { data: postings } = useMyPostings(user?.id)
  const { data: apps } = useApplicants(user?.id)

  const active = (postings ?? []).filter((p) => p.status === 'approved').length
  const pending = (postings ?? []).filter((p) => p.status === 'pending').length
  const total = (apps ?? []).length
  const hired = (apps ?? []).filter((a) => a.status === 'Hired').length

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your dashboard"
        title={`Hello, ${user?.name?.split(' ')[0] ?? 'partner'}`}
        description="Track your postings and applicants. Your editors are waiting."
        actions={
          <Link to="/postings/new">
            <GradientButton size="sm">
              <Plus className="h-4 w-4" /> New posting
            </GradientButton>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <MetricCard label="Active postings" value={active} icon={Briefcase} />
        <MetricCard label="Pending review" value={pending} icon={Clock} />
        <MetricCard label="Applicants" value={total} icon={Users} />
        <MetricCard label="Hired" value={hired} icon={CheckCircle2} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card size="hero" hoverable={false}>
          <EyebrowLabel>Quick actions</EyebrowLabel>
          <ul className="mt-4 divide-y divide-white/[0.06]">
            <QuickAction
              to="/postings/new"
              title="Post a new role"
              subtitle="5 minutes to fill out. Reviewed within a day."
            />
            <QuickAction
              to="/browse"
              title="Browse the network"
              subtitle="Short-list editors before posting a role."
            />
            <QuickAction
              to="/applicants"
              title="Review applicants"
              subtitle="Move applicants through your pipeline."
            />
          </ul>
        </Card>

        <Card size="hero" hoverable={false}>
          <EyebrowLabel>Recent applicants</EyebrowLabel>
          {(apps ?? []).length === 0 ? (
            <EmptyState
              icon={Users}
              title="No applicants yet"
              description="Post a role to start seeing applications."
              className="mt-4"
            />
          ) : (
            <ul className="mt-4 divide-y divide-white/[0.06]">
              {(apps ?? []).slice(0, 4).map((a) => (
                <li key={a.id}>
                  <Link
                    to="/applicants"
                    className="flex items-center gap-3 py-3 transition-opacity hover:opacity-90"
                  >
                    <Avatar name={a.editor.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{a.editor.name}</p>
                      <p className="truncate text-xs text-text-muted">
                        Applied to {a.job.title}
                      </p>
                    </div>
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
                    <span className="hidden text-[11px] text-text-muted sm:inline">
                      {timeAgo(a.created_at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

function QuickAction({
  to,
  title,
  subtitle,
}: {
  to: string
  title: string
  subtitle: string
}) {
  return (
    <li className="py-3">
      <Link
        to={to}
        className="group flex items-start justify-between gap-3 transition-colors hover:opacity-90"
      >
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-text-secondary">{subtitle}</p>
        </div>
        <span className="text-brand-purpleLight opacity-60 transition-opacity group-hover:opacity-100">
          →
        </span>
      </Link>
    </li>
  )
}
