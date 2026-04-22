import { X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { SKILLS_LIST } from '@/lib/constants'

export function SkillsSelector({
  value,
  onChange,
  options = SKILLS_LIST,
}: {
  value: string[]
  onChange: (next: string[]) => void
  options?: string[]
}) {
  const [query, setQuery] = useState('')
  const pool = options.filter(
    (o) => !value.includes(o) && o.toLowerCase().includes(query.toLowerCase()),
  )
  const canAddCustom =
    query.trim() !== '' &&
    !options.some((o) => o.toLowerCase() === query.trim().toLowerCase()) &&
    !value.some((v) => v.toLowerCase() === query.trim().toLowerCase())

  const add = (skill: string) => {
    onChange([...value, skill])
    setQuery('')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {value.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/10 px-3 py-1 text-xs text-brand-purpleLight"
          >
            {s}
            <button
              type="button"
              aria-label={`Remove ${s}`}
              onClick={() => onChange(value.filter((v) => v !== s))}
              className="rounded-full hover:bg-white/10"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search or add a skill…"
        className="mt-3 w-full rounded-lg border border-white/[0.08] bg-background-tertiary px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-purple/60"
      />

      {(pool.length > 0 || canAddCustom) && query ? (
        <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-white/[0.06] bg-background-tertiary p-1.5">
          {pool.slice(0, 10).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => add(o)}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-brand-purple/10 hover:text-brand-purpleLight"
            >
              {o}
            </button>
          ))}
          {canAddCustom ? (
            <button
              type="button"
              onClick={() => add(query.trim())}
              className={cn(
                'block w-full rounded-md px-3 py-2 text-left text-sm text-brand-purpleLight transition-colors hover:bg-brand-purple/10',
              )}
            >
              + Add "{query.trim()}"
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
