import { Outlet } from 'react-router-dom'
import { Topbar } from '@/components/Topbar'
import { useAuth } from '@/features/auth/AuthProvider'

export function PublicLayout() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
