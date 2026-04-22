import { useState } from 'react'
import { ExternalLink, Plus, X } from 'lucide-react'
import type { PortfolioLink } from '@/lib/types'
import { isHttpUrl } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GradientButton } from '@/components/shared/GradientButton'

export function PortfolioLinks({
  value,
  onChange,
}: {
  value: PortfolioLink[]
  onChange: (next: PortfolioLink[]) => void
}) {
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const add = () => {
    if (!label.trim() || !url.trim()) {
      setError('Both label and URL are required')
      return
    }
    if (!isHttpUrl(url.trim())) {
      setError('Use a full URL starting with http:// or https://')
      return
    }
    onChange([...value, { label: label.trim(), url: url.trim() }])
    setLabel('')
    setUrl('')
    setError(null)
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {value.map((l, i) => (
          <li
            key={`${l.url}-${i}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-background-tertiary/60 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{l.label}</p>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 truncate text-xs text-brand-purpleLight hover:underline"
              >
                {l.url} <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-white/[0.05] hover:text-status-danger"
              aria-label="Remove link"
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
        <div>
          <Label htmlFor="pl-label" className="sr-only">
            Label
          </Label>
          <Input
            id="pl-label"
            placeholder="Showreel"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="pl-url" className="sr-only">
            URL
          </Label>
          <Input
            id="pl-url"
            placeholder="https://vimeo.com/…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <GradientButton type="button" variant="ghost" onClick={add} className="whitespace-nowrap">
          <Plus className="h-4 w-4" /> Add link
        </GradientButton>
      </div>
      {error ? <p className="text-xs text-status-danger">{error}</p> : null}
    </div>
  )
}
