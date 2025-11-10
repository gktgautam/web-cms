import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import PublicJobs from '@/features/public/pages/PublicJobs'
import JobPublic from '@/features/public/pages/JobPublic'
import LoginPage from '@/features/auth/pages/LoginPage'
import JobsList from '@/features/jobs/pages/JobsList'
import JobNew from '@/features/jobs/pages/JobNew'
import JobDetail from '@/features/jobs/pages/JobDetail'
import JobEdit from '@/features/jobs/pages/JobEdit'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import DepartmentsPage from '@/features/departments/pages/DepartmentsPage'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PublicLayout } from '@/layouts/PublicLayout'

import '@/styles/tailwind.css'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicJobs />} />
        <Route path="/jobs/:slug" element={<JobPublic />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/jobs" element={<JobsList />} />
          <Route path="/dashboard/jobs/new" element={<JobNew />} />
          <Route path="/dashboard/jobs/:id" element={<JobDetail />} />
          <Route path="/dashboard/jobs/:id/edit" element={<JobEdit />} />

          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/dashboard/departments" element={<DepartmentsPage />} />
            <Route path="/dashboard/users/new" element={<RegisterPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
