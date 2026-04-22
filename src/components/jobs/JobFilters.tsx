import { Search } from 'lucide-react'
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  SKILLS_LIST,
  WORK_MODES,
} from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

export interface JobFilterState {
  search: string
  skill: string
  experience: string
  workMode: string
  employmentType: string
}

export function JobFilters({
  value,
  onChange,
  showEmploymentType = true,
}: {
  value: JobFilterState
  onChange: (next: JobFilterState) => void
  showEmploymentType?: boolean
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-5">
      <div className="relative md:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          className="pl-9"
          placeholder="Search titles or companies…"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
        />
      </div>
      <Select
        value={value.skill}
        onChange={(e) => onChange({ ...value, skill: e.target.value })}
      >
        <option value="">All skills</option>
        {SKILLS_LIST.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>
      <Select
        value={value.experience}
        onChange={(e) => onChange({ ...value, experience: e.target.value })}
      >
        <option value="">Any experience</option>
        {EXPERIENCE_LEVELS.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </Select>
      {showEmploymentType ? (
        <Select
          value={value.employmentType}
          onChange={(e) => onChange({ ...value, employmentType: e.target.value })}
        >
          <option value="">Any type</option>
          {EMPLOYMENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      ) : (
        <Select
          value={value.workMode}
          onChange={(e) => onChange({ ...value, workMode: e.target.value })}
        >
          <option value="">Any location</option>
          {WORK_MODES.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </Select>
      )}
    </div>
  )
}
