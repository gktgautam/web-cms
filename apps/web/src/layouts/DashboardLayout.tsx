import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

const navItems = [
  { to: '/dashboard/jobs', label: 'Jobs', adminOnly: false },
  { to: '/dashboard/departments', label: 'Departments', adminOnly: true },
  { to: '/dashboard/users/new', label: 'Invite user', adminOnly: true }
] as const;

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-blue-50 text-blue-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export function DashboardLayout() {
  const { user } = useAuth();

  const links = navItems.filter((item) => (item.adminOnly ? user?.role === 'ADMIN' : true));

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-60 border-r border-slate-200 bg-white lg:block">
        <div className="space-y-2 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dashboard</p>
          <nav className="flex flex-col gap-1">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1">
        <div className="border-b border-slate-200 bg-white lg:hidden">
          <nav className="flex gap-2 overflow-x-auto px-4 py-3">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
