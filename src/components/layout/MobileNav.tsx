import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, Shield, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/shared/Avatar'

export function MobileNav() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  if (!user) return null

  const items =
    user.role === 'editor'
      ? [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/jobs', label: 'Jobs' },
          { to: '/gigs', label: 'Gigs' },
          { to: '/applications', label: 'Applications' },
          { to: '/saved', label: 'Saved' },
          { to: '/messages', label: 'Messages' },
          { to: '/profile', label: 'Profile' },
        ]
      : user.role === 'partner'
        ? [
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/browse', label: 'Browse editors' },
            { to: '/postings', label: 'My postings' },
            { to: '/applicants', label: 'Applicants' },
            { to: '/messages', label: 'Messages' },
            { to: '/profile', label: 'Profile' },
          ]
        : [
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/admin/users', label: 'Users' },
            { to: '/admin/jobs', label: 'Jobs' },
            { to: '/admin/activity', label: 'Activity' },
            { to: '/messages', label: 'Messages' },
          ]

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.06] bg-background-primary/90 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple to-brand-purpleDeep">
            <Shield className="h-3.5 w-3.5 text-white" />
          </div>
          <p className="text-sm font-semibold">LevelUp</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-text-secondary hover:bg-white/[0.05]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] border-l border-white/[0.06] bg-background-secondary p-4">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold">Menu</p>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-text-muted hover:bg-white/[0.05]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {items.map((i) => (
                <NavLink
                  key={i.to}
                  to={i.to}
                  onClick={() => setOpen(false)}
                  end={i.to === '/dashboard'}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-lg px-3 py-2.5 text-sm transition-colors',
                      isActive
                        ? 'bg-brand-purple/10 text-brand-purpleLight'
                        : 'text-text-secondary hover:bg-white/[0.03] hover:text-text-primary',
                    )
                  }
                >
                  {i.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-6 rounded-xl border border-white/[0.06] p-3">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{user.name}</p>
                  <p className="truncate text-xs text-text-muted capitalize">
                    {user.role}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    await signOut()
                    setOpen(false)
                    navigate('/')
                  }}
                  className="rounded-lg p-2 text-text-muted hover:bg-white/[0.05]"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
