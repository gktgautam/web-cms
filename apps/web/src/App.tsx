import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import PublicJobs from './features/public/pages/PublicJobs';
import JobPublic from './features/public/pages/JobPublic';
import JobsList from './features/jobs/pages/JobsList';
import JobNew from './features/jobs/pages/JobNew';
import JobDetail from './features/jobs/pages/JobDetail';
import JobEdit from './features/jobs/pages/JobEdit';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { useAuth } from './features/auth/AuthProvider';
import DepartmentsPage from './features/departments/pages/DepartmentsPage';

import './styles/tailwind.css';

export default function App() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className='page_body flex flex-col relative min-h-screen'>

    <header className="w-full flex flex-col bg-white shadow-sm z-50 relative bg-opacity-100 px-5">
      <div className="lg:my-0 my-auto ">
          <div className="main-wrapper w-full flex gap-6">
            <div className="lg:max-w-[200px] w-full mb-3 mt-2">
              <a href="https://www.equentis.com" target="_blank" rel="noopener noreferrer"> 
                <img alt="Logo" className="w-auto min-w-[110px] h-[40px]" src="https://www.equentis.com/assets/Home_Page/equentis_logo.svg" />
            </a>
            </div>
            
            <div className="flex ml-auto space-x-6 items-center">
              
              <Link to="/">Public</Link>
              
              
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard/jobs">Dashboard</Link> 
                  {user?.role === 'ADMIN' && (
                      <>
                        <Link to="/dashboard/departments">Departments</Link>
                        <Link to="/dashboard/users/new">Invite user</Link>
                      </>
                    )}
                  <button type="button" onClick={handleLogout} className="btn btn-primary-animated">
                    Sign out
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary-animated">Sign in</Link>
              )}
            </div>
          </div>
      </div>
    </header>


    
    <div className='relative overflow-scrollable h-[calc(100vh-80px)] flex-grow'>
    
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
  );
}
