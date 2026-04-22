import { MapPin } from 'lucide-react'
import type { ProfileRow, UserRow, Tag } from '@/lib/types'
import { Card } from '@/components/shared/Card'
import { Avatar } from '@/components/shared/Avatar'
import { TagPill } from '@/components/shared/TagPill'

export function EditorCard({
  user,
  profile,
  onOpen,
}: {
  user: Pick<UserRow, 'id' | 'name'>
  profile: ProfileRow
  onOpen: () => void
}) {
  return (
    <button onClick={onOpen} className="text-left">
      <Card>
        <div className="flex items-start gap-4">
          <Avatar name={user.name} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="mt-0.5 text-xs text-text-secondary">
              {profile.experience ?? '—'}{' '}
              {profile.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {profile.location}
                </span>
              ) : null}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
              {profile.bio ?? 'No bio yet.'}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[11px] text-text-secondary"
                >
                  {s}
                </span>
              ))}
            </div>

            {profile.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.tags.map((t) => (
                  <TagPill key={t} tag={t as Tag} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </button>
  )
}
