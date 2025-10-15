import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/dashboard/jobs', label: 'Jobs' },
  { to: '/dashboard/jobs/new', label: 'Create job' },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-2xl px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand-500/15 text-white shadow-inner shadow-brand-500/30'
      : 'text-white/70 hover:bg-white/5 hover:text-white'
  }`

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl gap-8 px-6 py-10">
        <aside className="hidden w-64 flex-none flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur xl:flex">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-brand-300">AstraHire</div>
            <div className="mt-2 text-xl font-semibold text-white">Talent Ops</div>
            <p className="mt-3 text-sm text-white/60">
              Manage openings, collaborate with hiring managers, and publish roles to the careers site.
            </p>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} end={item.to === '/dashboard/jobs'}>
                <span className="h-2 w-2 rounded-full bg-brand-400/60" aria-hidden />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl bg-gradient-to-br from-brand-500/20 via-brand-500/10 to-transparent p-5">
            <p className="text-sm font-semibold text-white/90">Invite teammates</p>
            <p className="mt-1 text-xs text-white/60">Bring recruiters and hiring managers into the workflow.</p>
            <button className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10">
              Send invite
            </button>
          </div>
        </aside>
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur xl:hidden">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-brand-300">AstraHire</div>
              <div className="mt-1 text-lg font-semibold text-white">Talent Ops</div>
            </div>
            <nav className="flex gap-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClass} end={item.to === '/dashboard/jobs'}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="space-y-6 pb-24">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
