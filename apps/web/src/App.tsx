import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PublicJobs from './features/public/pages/PublicJobs'
import JobPublic from './features/public/pages/JobPublic'
import JobsList from './features/jobs/pages/JobsList'
import JobNew from './features/jobs/pages/JobNew'
import Login from './features/auth/pages/Login'
import { useAuth } from './features/auth/context/AuthContext'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default function App() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { to: '/', label: 'Public', requiresAuth: false },
    { to: '/dashboard/jobs', label: 'Dashboard', requiresAuth: true },
    { to: '/dashboard/jobs/new', label: 'New Job', requiresAuth: true },
  ]

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-6 shadow-xl shadow-slate-950/40 backdrop-blur md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-light/60">Logelin CMS</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Hiring dashboard</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-300">
            {navItems
              .filter((item) => !item.requiresAuth || user)
              .map((item) => {
                const isActive = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-full px-4 py-2 transition ${
                      isActive
                        ? 'bg-brand text-white shadow-lg shadow-brand/30'
                        : 'bg-white/5 text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            {!user && (
              <Link
                to="/login"
                className={`rounded-full px-4 py-2 transition ${
                  location.pathname === '/login'
                    ? 'bg-brand text-white shadow-lg shadow-brand/30'
                    : 'bg-white/5 text-slate-200 hover:bg-white/10'
                }`}
              >
                Login
              </Link>
            )}
          </nav>
          {user && (
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">
                {user.name}
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:text-white"
              >
                Sign out
              </button>
            </div>
          )}
        </header>

        <main className="mb-12 rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
          <Routes>
            <Route path="/" element={<PublicJobs />} />
            <Route path="/jobs/:slug" element={<JobPublic />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard/jobs"
              element={
                <RequireAuth>
                  <JobsList />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/jobs/new"
              element={
                <RequireAuth>
                  <JobNew />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}