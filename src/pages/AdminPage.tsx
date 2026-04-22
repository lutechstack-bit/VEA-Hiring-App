import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { AdminUsers } from '@/components/admin/AdminUsers'
import { AdminJobs } from '@/components/admin/AdminJobs'
import { AdminActivity } from '@/components/admin/AdminActivity'

export function AdminPage() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="jobs" element={<AdminJobs />} />
      <Route path="activity" element={<AdminActivity />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
