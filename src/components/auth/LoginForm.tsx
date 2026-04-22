import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GradientButton } from '@/components/shared/GradientButton'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type Values = z.infer<typeof schema>

export function LoginForm() {
  const { signIn } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (v) => {
    try {
      await signIn(v.email, v.password)
      navigate('/dashboard')
    } catch (err) {
      toast.error(
        'Sign-in failed',
        err instanceof Error ? err.message : 'Please try again',
      )
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-xs text-status-danger">{errors.password.message}</p>
        ) : null}
      </div>
      <GradientButton type="submit" size="lg" loading={isSubmitting} className="w-full">
        Sign in
      </GradientButton>
    </form>
  )
}
