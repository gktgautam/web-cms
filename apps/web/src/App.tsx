import { Navigate, Route, Routes } from 'react-router-dom';
import PublicJobs from './features/public/pages/PublicJobs';
import JobPublic from './features/public/pages/JobPublic';
import JobsList from './features/jobs/pages/JobsList';
import JobNew from './features/jobs/pages/JobNew';
import JobDetail from './features/jobs/pages/JobDetail';
import JobEdit from './features/jobs/pages/JobEdit';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { RootLayout } from './layouts/RootLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import DepartmentsPage from './features/departments/pages/DepartmentsPage';

import './styles/tailwind.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<PublicJobs />} />
        <Route path="jobs/:slug" element={<JobPublic />} />
        <Route path="login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="jobs" replace />} />
            <Route path="jobs">
              <Route index element={<JobsList />} />
              <Route path="new" element={<JobNew />} />
              <Route path=":id">
                <Route index element={<JobDetail />} />
                <Route path="edit" element={<JobEdit />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="users">
                <Route path="new" element={<RegisterPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
