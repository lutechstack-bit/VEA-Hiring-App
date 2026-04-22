import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AuthPage } from '@/pages/AuthPage'
import { LandingPage } from '@/pages/LandingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { JobsPage } from '@/pages/JobsPage'
import { GigsPage } from '@/pages/GigsPage'
import { JobDetailPage } from '@/pages/JobDetailPage'
import { ApplicationsPage } from '@/pages/ApplicationsPage'
import { MessagesPage } from '@/pages/MessagesPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { BrowseEditorsPage } from '@/pages/BrowseEditorsPage'
import { PostingsPage } from '@/pages/PostingsPage'
import { ApplicantsPage } from '@/pages/ApplicantsPage'
import { AdminPage } from '@/pages/AdminPage'
import { SavedJobsPage } from '@/pages/SavedJobsPage'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { RoleRoute } from '@/routes/RoleRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:threadId" element={<MessagesPage />} />

        <Route element={<RoleRoute roles={['editor']} />}>
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/gigs" element={<GigsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/saved" element={<SavedJobsPage />} />
        </Route>

        <Route element={<RoleRoute roles={['partner']} />}>
          <Route path="/browse" element={<BrowseEditorsPage />} />
          <Route path="/postings/*" element={<PostingsPage />} />
          <Route path="/applicants" element={<ApplicantsPage />} />
        </Route>

        <Route element={<RoleRoute roles={['admin']} />}>
          <Route path="/admin/*" element={<AdminPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
