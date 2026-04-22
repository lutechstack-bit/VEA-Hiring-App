import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { Role } from '@/lib/types'

export function RoleRoute({ roles }: { roles: Role[] }) {
  const { user } = useAuth()
  if (!user) return null
  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}
