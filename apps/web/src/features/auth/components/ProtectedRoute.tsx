import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthProvider'

type ProtectedRouteProps = {
  roles?: Array<'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER' | 'VIEWER'>
  redirectTo?: string
}

export function ProtectedRoute({ roles, redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, user, ready } = useAuth()
  const location = useLocation()

  if (!ready) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard/jobs" replace />
  }

  return <Outlet />
}
