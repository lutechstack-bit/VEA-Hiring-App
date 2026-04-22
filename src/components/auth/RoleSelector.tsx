import { Briefcase, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Role } from '@/lib/types'

export function RoleSelector({
  value,
  onChange,
}: {
  value: Role | null
  onChange: (role: Role) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RoleCard
        selected={value === 'editor'}
        onClick={() => onChange('editor')}
        icon={Video}
        title="Video Editor"
        description="I cut video. Looking for real work with verified partners."
      />
      <RoleCard
        selected={value === 'partner'}
        onClick={() => onChange('partner')}
        icon={Briefcase}
        title="Hiring Partner"
        description="I need to hire editors. Studios, creators, agencies — all welcome."
      />
    </div>
  )
}

function RoleCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative rounded-xl border p-5 text-left transition-all duration-200',
        selected
          ? 'border-brand-purple/60 bg-brand-purple/10 shadow-glow-sm'
          : 'border-white/[0.08] bg-background-tertiary hover:border-brand-purple/30',
      )}
    >
      <div
        className={cn(
          'mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
          selected
            ? 'bg-brand-purple/20 text-brand-purpleLight'
            : 'bg-white/[0.04] text-text-secondary group-hover:bg-brand-purple/10 group-hover:text-brand-purpleLight',
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-text-secondary">{description}</p>
    </button>
  )
}
