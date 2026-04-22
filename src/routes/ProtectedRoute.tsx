import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PendingApprovalScreen } from '@/components/auth/PendingApprovalScreen'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, user, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/auth" replace state={{ from: loc.pathname }} />
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Rejected users see a dedicated screen — they cannot access the app.
  // Pending users CAN access the dashboard so they can complete their profile
  // before the admin reviews and approves them.
  if (user.status === 'rejected') {
    return <PendingApprovalScreen status="rejected" />
  }

  return <>{children}</>
}
