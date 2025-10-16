import { FormEvent, useEffect, useState } from 'react'
import { useLocation, useNavigate, type Location } from 'react-router-dom'
import { useAuth } from '../AuthProvider'

type LocationState = {
  from?: Location
}

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | undefined
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <NavigateAfterLogin />
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(form)
      const next = state?.from?.pathname || '/dashboard/jobs'
      navigate(next, { replace: true })
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Unable to sign in'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center'>
    <div className='p-10 bg-gray-100'>
      <h1>Sign in</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={{ padding: 8 }}
          />
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{ padding: 8 }}
          />
        </label>
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
    </div>
  )
}

function NavigateAfterLogin() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/dashboard/jobs', { replace: true })
  }, [navigate])
  return null
}
