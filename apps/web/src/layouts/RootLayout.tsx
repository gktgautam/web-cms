import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
  }`;

export function RootLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <a href="https://www.equentis.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
            <img
              alt="Equentis logo"
              className="h-10 w-auto"
              src="https://www.equentis.com/assets/Home_Page/equentis_logo.svg"
            />
          </a>

          <nav className="ml-auto flex items-center gap-4">
            <NavLink to="/" end className={navLinkClassName}>
              Public
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard/jobs" className={navLinkClassName}>
                  Dashboard
                </NavLink>
                {user?.role === 'ADMIN' && (
                  <>
                    <NavLink to="/dashboard/departments" className={navLinkClassName}>
                      Departments
                    </NavLink>
                    <NavLink to="/dashboard/users/new" className={navLinkClassName}>
                      Invite user
                    </NavLink>
                  </>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <NavLink to="/login" className="btn btn-primary-animated text-sm">
                Sign in
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
