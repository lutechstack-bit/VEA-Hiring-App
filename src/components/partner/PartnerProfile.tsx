import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { useToast } from '@/hooks/useToast'
import { PageHeader } from '@/components/layout/PageHeader'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { GradientButton } from '@/components/shared/GradientButton'
import { EyebrowLabel } from '@/components/shared/EyebrowLabel'

const schema = z.object({
  bio: z.string().max(600).optional(),
  location: z.string().max(80).optional(),
  website: z.string().url().or(z.literal('')).optional(),
})
type Values = z.infer<typeof schema>

export function PartnerProfile() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id)
  const { mutateAsync, isPending } = useUpdateProfile()
  const toast = useToast()
  const { register, handleSubmit, reset } = useForm<Values>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!profile) return
    reset({
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      website: profile.website ?? '',
    })
  }, [profile, reset])

  const submit = handleSubmit(async (v) => {
    if (!user) return
    try {
      await mutateAsync({
        userId: user.id,
        patch: {
          bio: v.bio ?? '',
          location: v.location ?? '',
          website: v.website ?? null,
        },
      })
      toast.success('Profile saved')
    } catch (err) {
      toast.error('Could not save', err instanceof Error ? err.message : undefined)
    }
  })

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Your profile"
        title="Company details"
        description="Editors see this when you reach out or post a role."
      />
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-white/[0.06] bg-background-secondary p-6">
        <EyebrowLabel>About</EyebrowLabel>
        <div>
          <Label htmlFor="bio">Company bio</Label>
          <Textarea
            id="bio"
            rows={4}
            placeholder="What you do, who you work with, what makes you a great partner."
            {...register('bio')}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="loc">Location</Label>
            <Input id="loc" placeholder="Mumbai, MH" {...register('location')} />
          </div>
          <div>
            <Label htmlFor="web">Website</Label>
            <Input id="web" placeholder="https://example.com" {...register('website')} />
          </div>
        </div>
        <div className="flex justify-end">
          <GradientButton type="submit" loading={isPending}>
            Save
          </GradientButton>
        </div>
      </form>
    </div>
  )
}
