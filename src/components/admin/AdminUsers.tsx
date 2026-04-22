import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {
  useAdminUsers,
  useSetUserStatus,
  useSetUserTags,
} from '@/hooks/useAdmin'
import { useToast } from '@/hooks/useToast'
import type { Role, Tag, UserStatus } from '@/lib/types'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/shared/Card'
import { Avatar } from '@/components/shared/Avatar'
import { StatusPill } from '@/components/shared/StatusPill'
import { GradientButton } from '@/components/shared/GradientButton'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ListSkeleton } from '@/components/shared/LoadingSpinner'
import { TagAssignment } from './TagAssignment'

export function AdminUsers() {
  const { data, isLoading } = useAdminUsers()
  const setStatus = useSetUserStatus()
  const setTags = useSetUserTags()
  const toast = useToast()

  const [search, setSearch] = useState('')
  const [role, setRole] = useState<'' | Role>('')
  const [status, setStatusFilter] = useState<'' | UserStatus>('')

  const rows = useMemo(() => {
    let list = data ?? []
    if (role) list = list.filter((u) => u.role === role)
    if (status) list = list.filter((u) => u.status === status)
    if (search) {
      const s = search.toLowerCase()
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s),
      )
    }
    return list
  }, [data, role, status, search])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Approve, reject, and curate the trust tags for the network."
      />

      <div className="grid gap-2 sm:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            className="pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={role} onChange={(e) => setRole(e.target.value as Role | '')}>
          <option value="">All roles</option>
          <option value="editor">Editor</option>
          <option value="partner">Partner</option>
          <option value="admin">Admin</option>
        </Select>
        <Select
          value={status}
          onChange={(e) => setStatusFilter(e.target.value as UserStatus | '')}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>

      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : (
        <div className="space-y-3">
          {rows.map((u) => (
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
                  {u.role === 'editor' && u.profile ? (
                    <div className="mt-3">
                      <p className="text-[11px] uppercase tracking-wider text-text-muted">
                        Tags
                      </p>
                      <div className="mt-1.5">
                        <TagAssignment
                          value={u.profile.tags as Tag[]}
                          onChange={async (tags) => {
                            try {
                              await setTags.mutateAsync({ userId: u.id, tags })
                              toast.success('Tags updated')
                            } catch (err) {
                              toast.error(
                                'Could not update',
                                err instanceof Error ? err.message : undefined,
                              )
                            }
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <StatusPill
                    tone={
                      u.status === 'approved'
                        ? 'success'
                        : u.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                    }
                  >
                    {u.status}
                  </StatusPill>
                  <div className="flex gap-2">
                    {u.status !== 'approved' ? (
                      <GradientButton
                        size="sm"
                        onClick={async () => {
                          try {
                            await setStatus.mutateAsync({ id: u.id, status: 'approved' })
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
                    {u.status !== 'rejected' ? (
                      <GradientButton
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await setStatus.mutateAsync({ id: u.id, status: 'rejected' })
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
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
