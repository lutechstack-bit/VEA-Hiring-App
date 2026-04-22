import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'
import { useAuth } from '@/hooks/useAuth'
import type { Role } from '@/lib/types'

export function AuthPage() {
  const [params] = useSearchParams()
  const initialMode = (params.get('mode') ?? 'login') as 'login' | 'signup'
  const initialRole = (params.get('role') as Role) ?? null
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const { session, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (session && user?.status === 'approved') navigate('/dashboard', { replace: true })
  }, [session, user, navigate])

  return (
    <AuthLayout
      title={mode === 'login' ? 'Welcome back' : 'Create your account'}
      subtitle={
        mode === 'login'
          ? 'Sign in to your LevelUp account'
          : 'Join the curated talent network for video editors.'
      }
      footer={
        mode === 'login' ? (
          <>
            New to LevelUp?{' '}
            <button
              onClick={() => setMode('signup')}
              className="text-brand-purpleLight hover:underline"
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-brand-purpleLight hover:underline"
            >
              Sign in
            </button>
          </>
        )
      }
    >
      {mode === 'login' ? <LoginForm /> : <SignupForm initialRole={initialRole} />}

      <div className="mt-4 border-t border-white/[0.06] pt-4 text-center text-[11px] text-text-muted">
        By continuing, you agree to our{' '}
        <Link to="/" className="underline-offset-4 hover:underline">
          terms
        </Link>{' '}
        and{' '}
        <Link to="/" className="underline-offset-4 hover:underline">
          privacy policy
        </Link>
        .
      </div>
    </AuthLayout>
  )
}
