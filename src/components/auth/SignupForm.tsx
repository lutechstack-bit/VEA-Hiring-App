import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GradientButton } from '@/components/shared/GradientButton'
import { RoleSelector } from './RoleSelector'
import type { Role } from '@/lib/types'

const schema = z.object({
  name: z.string().min(2, 'Tell us your name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Use at least 6 characters'),
})

type Values = z.infer<typeof schema>

export function SignupForm({ initialRole }: { initialRole?: Role | null }) {
  const { signUp } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role | null>(initialRole ?? null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (v) => {
    if (!role) {
      toast.error('Pick a role', 'Editor or Hiring Partner.')
      return
    }
    try {
      await signUp({ ...v, role })
      toast.success(
        'Account created',
        'Check your email if confirmation is required, then log in.',
      )
      navigate('/dashboard')
    } catch (err) {
      toast.error(
        'Sign-up failed',
        err instanceof Error ? err.message : 'Please try again',
      )
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Label className="mb-2 block">I am a</Label>
        <RoleSelector value={role} onChange={setRole} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" autoComplete="name" {...register('name')} />
        {errors.name ? (
          <p className="text-xs text-status-danger">{errors.name.message}</p>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email ? (
          <p className="text-xs text-status-danger">{errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-xs text-status-danger">{errors.password.message}</p>
        ) : null}
      </div>
      <GradientButton type="submit" size="lg" loading={isSubmitting} className="w-full">
        Create account
      </GradientButton>
      <p className="text-center text-[11px] text-text-muted">
        Your account is reviewed by an admin before activation. Usually within 24 hours.
      </p>
    </form>
  )
}
