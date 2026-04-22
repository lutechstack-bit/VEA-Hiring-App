import { NavLink, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  ClipboardList,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Sparkles,
  Users,
  UserSquare2,
  Bookmark,
  Shield,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/shared/Avatar'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

function navFor(role: 'editor' | 'partner' | 'admin'): NavItem[] {
  const base: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: Home, end: true },
  ]
  if (role === 'editor') {
    return [
      ...base,
      { to: '/jobs', label: 'Jobs', icon: Briefcase },
      { to: '/gigs', label: 'Gigs', icon: Zap },
      { to: '/applications', label: 'My applications', icon: ClipboardList },
      { to: '/saved', label: 'Saved', icon: Bookmark },
      { to: '/messages', label: 'Messages', icon: MessageSquare },
      { to: '/profile', label: 'Profile', icon: UserSquare2 },
    ]
  }
  if (role === 'partner') {
    return [
      ...base,
      { to: '/browse', label: 'Browse editors', icon: Users },
      { to: '/postings', label: 'My postings', icon: Briefcase },
      { to: '/applicants', label: 'Applicants', icon: ClipboardList },
      { to: '/messages', label: 'Messages', icon: MessageSquare },
      { to: '/profile', label: 'Profile', icon: Settings },
    ]
  }
  return [
    ...base,
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/admin/activity', label: 'Activity', icon: Sparkles },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
  ]
}

export function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  if (!user) return null
  const items = navFor(user.role)

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[260px] flex-col border-r border-white/[0.06] bg-background-secondary/60 px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple to-brand-purpleDeep shadow-glow-sm">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-text-primary">
            LevelUp
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
            Talent Network
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-brand-purple/10 text-brand-purpleLight'
                  : 'text-text-secondary hover:bg-white/[0.03] hover:text-text-primary',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-xl border border-white/[0.06] bg-background-tertiary/50 p-3">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
            <p className="truncate text-[11px] text-text-muted capitalize">{user.role}</p>
          </div>
          <button
            onClick={async () => {
              await signOut()
              navigate('/')
            }}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/[0.05] hover:text-text-primary"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
