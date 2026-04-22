import type { ProfileRow, UserRow } from '@/lib/types'
import { useSetUserStatus } from '@/hooks/useAdmin'
import { useToast } from '@/hooks/useToast'
import { Avatar } from '@/components/shared/Avatar'
import { GradientButton } from '@/components/shared/GradientButton'
import { Card } from '@/components/shared/Card'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'
import { EmptyState } from '@/components/shared/EmptyState'
import { UserCheck } from 'lucide-react'

export function ApprovalQueue({
  users,
}: {
  users: (UserRow & { profile: ProfileRow | null })[]
}) {
  const setStatus = useSetUserStatus()
  const toast = useToast()
  const pending = users.filter((u) => u.status === 'pending')

  if (!pending.length) {
    return (
      <EmptyState
        icon={UserCheck}
        title="Nothing in the queue"
        description="All new sign-ups have been reviewed."
      />
    )
  }

  const act = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await setStatus.mutateAsync({ id, status })
      toast.success(`User ${status}`)
    } catch (err) {
      toast.error(
        'Could not update',
        err instanceof Error ? err.message : undefined,
      )
    }
  }

  return (
    <div className="space-y-3">
      <EyebrowLabel>Approval queue</EyebrowLabel>
      <div className="grid gap-3">
        {pending.map((u) => (
          <Card key={u.id} hoverable={false}>
            <div className="flex flex-wrap items-start gap-4">
              <Avatar name={u.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-text-secondary">
                  {u.email} · {u.role}
                </p>
                {u.profile?.bio ? (
                  <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
                    {u.profile.bio}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-2">
                <GradientButton
                  size="sm"
                  variant="outline"
                  onClick={() => act(u.id, 'rejected')}
                >
                  Reject
                </GradientButton>
                <GradientButton size="sm" onClick={() => act(u.id, 'approved')}>
                  Approve
                </GradientButton>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
