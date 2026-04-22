import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { useToast } from '@/hooks/useToast'
import {
  EXPERIENCE_LEVELS,
  QUALIFICATIONS_LIST,
} from '@/lib/constants'
import type { Experience, PortfolioLink, Tag } from '@/lib/types'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { GradientButton } from '@/components/shared/GradientButton'
import { SkillsSelector } from './SkillsSelector'
import { PortfolioLinks } from './PortfolioLinks'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'
import { Avatar } from '@/components/shared/Avatar'
import { TagPill } from '@/components/shared/TagPill'
import { cn } from '@/lib/utils'

const schema = z.object({
  bio: z.string().max(600, 'Keep your bio under 600 characters').optional(),
  location: z.string().max(80).optional(),
  experience: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
})

type Values = z.infer<typeof schema>

export function EditorProfile() {
  const { user } = useAuth()
  const { data: profile, isLoading } = useProfile(user?.id)
  const { mutateAsync, isPending } = useUpdateProfile()
  const toast = useToast()

  const [skills, setSkills] = useState<string[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioLink[]>([])
  const [quals, setQuals] = useState<string[]>([])

  const { register, handleSubmit, reset, watch } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { bio: '', location: '', experience: undefined },
  })

  useEffect(() => {
    if (!profile) return
    reset({
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      experience: profile.experience ?? undefined,
    })
    setSkills(profile.skills)
    setPortfolio(profile.portfolio_links)
    setQuals(profile.qualifications)
  }, [profile, reset])

  const submit = handleSubmit(async (v) => {
    if (!user) return
    try {
      await mutateAsync({
        userId: user.id,
        patch: {
          bio: v.bio ?? '',
          location: v.location ?? '',
          experience: (v.experience ?? null) as Experience | null,
          skills,
          portfolio_links: portfolio,
          qualifications: quals,
        },
      })
      toast.success('Profile saved')
    } catch (err) {
      toast.error('Could not save', err instanceof Error ? err.message : undefined)
    }
  })

  const bioLen = (watch('bio') ?? '').length

  const preview = useMemo(
    () => ({
      name: user?.name ?? '',
      bio: watch('bio') ?? '',
      location: watch('location') ?? '',
      experience: watch('experience'),
      skills,
    }),
    [user, watch, skills],
  )

  if (isLoading) {
    return <p className="text-sm text-text-secondary">Loading…</p>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your profile"
        title="Edit your editor profile"
        description="This is what hiring partners see when browsing the network."
      />

      {(profile?.tags?.length ?? 0) > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/[0.06] bg-background-secondary p-4">
          <EyebrowLabel>Admin tags</EyebrowLabel>
          <div className="flex flex-wrap gap-2">
            {(profile?.tags ?? []).map((t) => (
              <TagPill key={t} tag={t as Tag} />
            ))}
          </div>
        </div>
      ) : null}

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-white/[0.06] bg-background-secondary p-6">
            <EyebrowLabel>About you</EyebrowLabel>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={5}
                  placeholder="What do you edit? What do you love? Who have you worked with?"
                  {...register('bio')}
                />
                <p className="mt-1 text-right text-[11px] text-text-muted">
                  {bioLen}/600
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="loc">Location</Label>
                  <Input id="loc" placeholder="City, state" {...register('location')} />
                </div>
                <div>
                  <Label htmlFor="exp">Experience level</Label>
                  <Select id="exp" {...register('experience')}>
                    <option value="">Select…</option>
                    {EXPERIENCE_LEVELS.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.06] bg-background-secondary p-6">
            <EyebrowLabel>Skills</EyebrowLabel>
            <p className="mt-1 text-sm text-text-secondary">
              Add 3+ skills so partners can match you to roles.
            </p>
            <div className="mt-4">
              <SkillsSelector value={skills} onChange={setSkills} />
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.06] bg-background-secondary p-6">
            <EyebrowLabel>Portfolio</EyebrowLabel>
            <p className="mt-1 text-sm text-text-secondary">
              Showreels, project pages, Vimeo, YouTube — paste one link per row.
            </p>
            <div className="mt-4">
              <PortfolioLinks value={portfolio} onChange={setPortfolio} />
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.06] bg-background-secondary p-6">
            <EyebrowLabel>What you bring</EyebrowLabel>
            <p className="mt-1 text-sm text-text-secondary">
              Self-attested qualifications partners look for.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {QUALIFICATIONS_LIST.map((q) => {
                const active = quals.includes(q)
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() =>
                      setQuals(active ? quals.filter((x) => x !== q) : [...quals, q])
                    }
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs transition-all',
                      active
                        ? 'border-brand-purple/40 bg-brand-purple/10 text-brand-purpleLight'
                        : 'border-white/[0.08] bg-background-tertiary text-text-secondary hover:border-brand-purple/30',
                    )}
                  >
                    {active ? <Check className="mr-1 inline h-3 w-3" /> : null}
                    {q}
                  </button>
                )
              })}
            </div>
          </section>

          <div className="flex justify-end">
            <GradientButton type="submit" loading={isPending}>
              Save changes
            </GradientButton>
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-1">
          <section className="sticky top-4 rounded-2xl border border-white/[0.06] bg-background-secondary p-6">
            <EyebrowLabel>Public preview</EyebrowLabel>
            <p className="mt-1 text-xs text-text-muted">
              How partners see your profile
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={preview.name} size="lg" />
              <div>
                <p className="font-medium">{preview.name}</p>
                <p className="text-xs text-text-secondary">
                  {preview.location || '—'} · {preview.experience || '—'}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-text-secondary line-clamp-5 whitespace-pre-wrap">
              {preview.bio || 'Add a bio so partners know what you\u2019re about.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {preview.skills.slice(0, 6).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[11px] text-text-secondary"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </form>
    </div>
  )
}
