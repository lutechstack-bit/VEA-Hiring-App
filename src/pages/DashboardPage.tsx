import { useAuth } from '@/hooks/useAuth'
import { EditorDashboard } from '@/components/editor/EditorDashboard'
import { PartnerDashboard } from '@/components/partner/PartnerDashboard'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export function DashboardPage() {
  const { user } = useAuth()
  if (!user) return null
  if (user.role === 'editor') return <EditorDashboard />
  if (user.role === 'partner') return <PartnerDashboard />
  return <AdminDashboard />
}
