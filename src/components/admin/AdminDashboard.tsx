import {
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Clock,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react'
import { useAdminMetrics, useAdminUsers } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/layout/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'
import { ApprovalQueue } from './ApprovalQueue'
import { Card } from '@/components/shared/Card'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'
import { Link } from 'react-router-dom'

export function AdminDashboard() {
  const { data: metrics } = useAdminMetrics()
  const { data: users } = useAdminUsers()

  const pending = (users ?? []).filter((u) => u.status === 'pending').length

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Network overview"
        description="Keep the network healthy — approve users, curate tags, oversee postings."
      />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <MetricCard label="Total users" value={metrics?.users ?? 0} icon={Users} />
        <MetricCard
          label="Editors"
          value={metrics?.editors ?? 0}
          icon={UserCheck}
        />
        <MetricCard
          label="Partners"
          value={metrics?.partners ?? 0}
          icon={Briefcase}
        />
        <MetricCard
          label="Pending approval"
          value={metrics?.pendingUsers ?? 0}
          icon={Clock}
          hint={pending > 0 ? 'Needs your review' : 'All clear'}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <MetricCard label="Active jobs" value={metrics?.activeJobs ?? 0} icon={Briefcase} />
        <MetricCard label="Active gigs" value={metrics?.activeGigs ?? 0} icon={Zap} />
        <MetricCard
          label="Applications"
          value={metrics?.applications ?? 0}
          icon={ClipboardList}
        />
        <MetricCard
          label="Hires"
          value={metrics?.hires ?? 0}
          icon={CheckCircle2}
        />
      </div>

      <ApprovalQueue users={users ?? []} />

      <Card size="hero" hoverable={false}>
        <EyebrowLabel>Jump to</EyebrowLabel>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <AdminLink to="/admin/users" label="Manage users" />
          <AdminLink to="/admin/jobs" label="Review jobs" />
          <AdminLink to="/admin/activity" label="Activity feed" />
        </div>
      </Card>
    </div>
  )
}

function AdminLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-white/[0.06] bg-background-tertiary/50 px-4 py-3 text-sm transition-all hover:border-brand-purple/30 hover:bg-brand-purple/5"
    >
      <span className="flex items-center justify-between">
        {label}
        <span className="text-brand-purpleLight opacity-60 transition-opacity group-hover:opacity-100">
          →
        </span>
      </span>
    </Link>
  )
}
