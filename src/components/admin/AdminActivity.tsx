import { useAdminActivity } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/shared/Card'
import { EmptyState } from '@/components/shared/EmptyState'
import { ListSkeleton } from '@/components/shared/LoadingSpinner'
import { Sparkles } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

export function AdminActivity() {
  const { data, isLoading } = useAdminActivity()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Activity feed"
        description="The last 30 admin-relevant events in one place."
      />
      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : (data ?? []).length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No activity yet"
          description="Actions across the network will show up here."
        />
      ) : (
        <div className="space-y-2">
          {(data ?? []).map((a) => (
            <Card key={a.id} hoverable={false} padded={false} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{a.action.replace(/_/g, ' ')}</span>
                    {a.target_type ? (
                      <span className="text-text-muted"> · {a.target_type}</span>
                    ) : null}
                  </p>
                  {a.metadata &&
                  typeof a.metadata === 'object' &&
                  Object.keys(a.metadata).length > 0 ? (
                    <pre className="mt-1 truncate text-xs text-text-muted">
                      {JSON.stringify(a.metadata)}
                    </pre>
                  ) : null}
                </div>
                <span className="shrink-0 text-[11px] text-text-muted">
                  {timeAgo(a.created_at)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
