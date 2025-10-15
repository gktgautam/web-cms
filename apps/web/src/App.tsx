import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom'
import PublicJobs from './features/public/pages/PublicJobs'
import JobPublic from './features/public/pages/JobPublic'
import JobsList from './features/jobs/pages/JobsList'
import JobNew from './features/jobs/pages/JobNew'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import { ProtectedRoute } from './features/auth/components/ProtectedRoute'
import { useAuth } from './features/auth/AuthProvider'

export default function App(){
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div style={{fontFamily:'system-ui', padding:16}}>
      <header style={{display:'flex', gap:12, marginBottom:16}}>
        <Link to="/">Public</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard/jobs">Dashboard</Link>
            <Link to="/dashboard/jobs/new">New Job</Link>
            {user?.role === 'ADMIN' && <Link to="/dashboard/users/new">Invite user</Link>}
            <button type="button" onClick={handleLogout} style={{ marginLeft: 'auto', padding: '4px 8px' }}>
              Sign out
            </button>
          </>
        ) : (
          <Link to="/login">Sign in</Link>
        )}
      </header>
      <Routes>
        <Route path="/" element={<PublicJobs/>}/>
        <Route path="/jobs/:slug" element={<JobPublic/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/jobs" element={<JobsList/>}/>
          <Route path="/dashboard/jobs/new" element={<JobNew/>}/>
        </Route>
        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route path="/dashboard/users/new" element={<RegisterPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}