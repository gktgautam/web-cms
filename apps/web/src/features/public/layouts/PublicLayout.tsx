import { NavLink, Outlet } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-white text-slate-900 shadow-lg shadow-brand-500/30'
      : 'text-white/80 hover:bg-white/10'
  }`

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(circle_at_top,_rgba(77,125,255,0.35),_transparent_65%)]" />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-10">
        <NavLink to="/" className="text-lg font-semibold tracking-tight text-white">
          AstraHire
        </NavLink>
        <nav className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
          <NavLink to="/" className={navLinkClass} end>
            Careers
          </NavLink>
          <NavLink to="/dashboard/jobs" className={navLinkClass}>
            Team Portal
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto mt-12 w-full max-w-5xl px-6 pb-24">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 bg-slate-950/40 py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AstraHire. All rights reserved.</p>
          <p className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Accessibility</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
