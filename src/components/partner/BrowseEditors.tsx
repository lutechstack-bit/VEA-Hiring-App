import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import { useEditors, type EditorListItem } from '@/hooks/useEditors'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ListSkeleton } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { SKILLS_LIST, TAG_LIST } from '@/lib/constants'
import { EditorCard } from './EditorCard'
import { EditorDetailDrawer } from './EditorDetailDrawer'

export function BrowseEditors() {
  const [search, setSearch] = useState('')
  const [tag, setTag] = useState('')
  const [skill, setSkill] = useState('')
  const { data, isLoading } = useEditors({ search, tag, skill })
  const [selected, setSelected] = useState<EditorListItem | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="The network"
        title="Browse editors"
        description="All verified. Filter by skill, tag, or keyword."
      />

      <div className="grid gap-2 sm:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            className="pl-9"
            placeholder="Search name or bio…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">All tags</option>
          {TAG_LIST.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Select value={skill} onChange={(e) => setSkill(e.target.value)}>
          <option value="">All skills</option>
          {SKILLS_LIST.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : data && data.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {data.map((e) => (
            <EditorCard
              key={e.user.id}
              user={e.user}
              profile={e.profile}
              onOpen={() => setSelected(e)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No editors match those filters"
          description="Try broadening your search. New editors join every week."
        />
      )}

      <EditorDetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        editor={selected}
      />
    </div>
  )
}
