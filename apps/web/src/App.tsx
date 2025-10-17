import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PublicJobs from '@/features/public/pages/PublicJobs';
import JobPublic from '@/features/public/pages/JobPublic';
import JobsList from '@/features/jobs/pages/JobsList';
import JobNew from '@/features/jobs/pages/JobNew';
import JobDetail from '@/features/jobs/pages/JobDetail';
import JobEdit from '@/features/jobs/pages/JobEdit';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { useAuth } from '@/features/auth/AuthProvider';
import DepartmentsPage from '@/features/departments/pages/DepartmentsPage';

import '@/styles/tailwind.css';

export default function App() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true); // toggle sidebar

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="page_body flex min-h-screen">
      
      {/* Sidebar */}
      {isAuthenticated && (
        <aside className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
          
          {/* Logo */}
          <div className="flex items-center justify-between p-4">
            {sidebarOpen && (
              <img
                src="https://www.equentis.com/assets/Home_Page/equentis_logo.svg"
                alt="Logo"
                className="w-auto h-10"
              />
            )}
            <button onClick={toggleSidebar} className="ml-auto text-white focus:outline-none">
              {sidebarOpen ? '⬅️' : '➡️'}
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col mt-5 space-y-2">
            <Link to="/dashboard/jobs" className="px-4 py-2 hover:bg-gray-700 rounded">
              {sidebarOpen ? 'Jobs' : '📄'}
            </Link>

            {user?.role === 'ADMIN' && (
              <>
                <Link to="/dashboard/departments" className="px-4 py-2 hover:bg-gray-700 rounded">
                  {sidebarOpen ? 'Departments' : '🏢'}
                </Link>
                <Link to="/dashboard/users/new" className="px-4 py-2 hover:bg-gray-700 rounded">
                  {sidebarOpen ? 'Invite User' : '👤'}
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="mt-auto px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
            >
              {sidebarOpen ? 'Sign Out' : '🚪'}
            </button>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="w-full flex items-center justify-between bg-white shadow-sm px-5 h-20">
          <div className="flex items-center gap-6">
            {!isAuthenticated && (
              <a href="https://www.equentis.com" target="_blank" rel="noopener noreferrer">
                <img
                  alt="Logo"
                  className="w-auto min-w-[110px] h-[40px]"
                  src="https://www.equentis.com/assets/Home_Page/equentis_logo.svg"
                />
              </a>
            )}
            <Link to="/">Public</Link>
          </div>

          {!isAuthenticated && (
            <div>
              <Link to="/login" className="btn btn-primary-animated">
                Sign in
              </Link>
            </div>
          )}
        </header>

        {/* Routes */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<PublicJobs />} />
            <Route path="/jobs/:slug" element={<JobPublic />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard/jobs" element={<JobsList />} />
              <Route path="/dashboard/jobs/new" element={<JobNew />} />
              <Route path="/dashboard/jobs/:id" element={<JobDetail />} />
              <Route path="/dashboard/jobs/:id/edit" element={<JobEdit />} />
            </Route>

            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route path="/dashboard/departments" element={<DepartmentsPage />} />
              <Route path="/dashboard/users/new" element={<RegisterPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
