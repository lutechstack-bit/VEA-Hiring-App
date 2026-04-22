import { Clock, LogOut, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { GradientButton } from '@/components/shared/GradientButton'
import type { UserStatus } from '@/lib/types'
import { useNavigate } from 'react-router-dom'

export function PendingApprovalScreen({ status }: { status: UserStatus }) {
  const { signOut, user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const rejected = status === 'rejected'

  return (
    <div className="page-hero relative flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-background-secondary p-8 text-center">
        <div
          className={
            'mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ' +
            (rejected
              ? 'bg-status-dangerBg text-status-danger'
              : 'bg-brand-purple/10 text-brand-purpleLight')
          }
        >
          {rejected ? (
            <ShieldAlert className="h-6 w-6" />
          ) : (
            <ShieldCheck className="h-6 w-6" />
          )}
        </div>
        <h1 className="text-2xl font-medium">
          {rejected ? 'Application not approved' : 'Awaiting approval'}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {rejected
            ? 'Your application wasn\u2019t approved this time. Reach out if you\u2019d like feedback.'
            : 'Thanks for signing up! An admin is reviewing your account. You\u2019ll get access as soon as we verify your profile.'}
        </p>

        {!rejected ? (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-background-tertiary px-4 py-3 text-xs text-text-muted">
            <Clock className="h-3.5 w-3.5" />
            Typical review time: under 24 hours
          </div>
        ) : (
          <a
            className="mt-6 inline-flex items-center justify-center text-sm text-brand-purpleLight underline-offset-4 hover:underline"
            href="mailto:hello@levelup.com"
          >
            Contact the LevelUp team
          </a>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <GradientButton
            variant="ghost"
            className="w-full"
            onClick={() => refreshUser()}
          >
            Refresh status
          </GradientButton>
          <GradientButton
            variant="outline"
            className="w-full"
            onClick={async () => {
              await signOut()
              navigate('/')
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </GradientButton>
        </div>

        <p className="mt-6 text-[11px] text-text-muted">
          Signed in as <span className="text-text-secondary">{user?.email}</span>
        </p>
      </div>
    </div>
  )
}
