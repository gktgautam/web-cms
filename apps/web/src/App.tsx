import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from './features/public/layouts/PublicLayout'
import PublicJobs from './features/public/pages/PublicJobs'
import JobPublic from './features/public/pages/JobPublic'
import DashboardLayout from './features/jobs/layouts/DashboardLayout'
import JobsList from './features/jobs/pages/JobsList'
import JobNew from './features/jobs/pages/JobNew'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<PublicJobs />} />
        <Route path="jobs/:slug" element={<JobPublic />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="jobs" replace />} />
        <Route path="jobs" element={<JobsList />} />
        <Route path="jobs/new" element={<JobNew />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
