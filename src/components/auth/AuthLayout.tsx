import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="page-hero relative min-h-screen overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple to-brand-purpleDeep">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">LevelUp</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
              Talent Network
            </p>
          </div>
        </Link>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <h1 className="text-center text-2xl font-medium tracking-tight sm:text-3xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-center text-sm text-text-secondary">{subtitle}</p>
            ) : null}

            <div className="mt-8 rounded-2xl border border-white/[0.06] bg-background-secondary p-6 sm:p-8">
              {children}
            </div>
            {footer ? (
              <div className="mt-6 text-center text-sm text-text-secondary">{footer}</div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
