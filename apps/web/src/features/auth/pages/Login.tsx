import { FormEvent, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, error, isLoading, user } = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  if (user) {
    return <Navigate to="/dashboard/jobs" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const success = await login({ identifier, password })
    if (success) {
      navigate('/dashboard/jobs', { replace: true })
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-slate-900/70 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-light/70">Logelin CMS</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Sign in to continue</h1>
            <p className="mt-2 text-sm text-slate-300">Access to the dashboard is restricted to the Logelin team.</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="identifier">
                Email or username
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-brand"
                placeholder="logelin or logelin@cms.com"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-brand"
                placeholder="Enter the Logelin password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <p className="rounded-lg bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-slate-400">
            Hint: use <span className="font-medium text-white">logelin</span> and password <span className="font-medium text-white">cms123</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
