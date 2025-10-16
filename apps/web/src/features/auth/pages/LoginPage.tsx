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
    <div className='flex items-center justify-center h-full flex-grow'>
    <div className='p-10 bg-gray-100 min-w-[400px]'>
      <h1 className='text-2xl font-bold'>Sign in</h1>
      {error && <p className='text-red-500'>{error}</p>}

      <form onSubmit={onSubmit} className='grid gap-3 mt-5'>
         <div>
            <label className='field-label'>Email</label> 
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className='input' />
         </div>

        <div>
          <label className='field-label'>Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className='input' />
        </div>
       
        <button type="submit" disabled={loading} className='btn btn-primary-animated mt-3'>
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
