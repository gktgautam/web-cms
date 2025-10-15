import { FormEvent, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import { useAuth } from '../AuthProvider'

const roles = ['ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'VIEWER'] as const

type RegisterFormState = {
  name: string
  email: string
  password: string
  role: typeof roles[number]
  departmentId: string
}

type Department = {
  id: string
  name: string
}

export default function RegisterPage() {
  const { register } = useAuth()
  const [form, setForm] = useState<RegisterFormState>({
    name: '',
    email: '',
    password: '',
    role: 'RECRUITER',
    departmentId: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { data: departments, isLoading: departmentsLoading, error: departmentsError } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => (await api.get('/departments')).data
  })

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      }
      if (form.departmentId) payload.departmentId = form.departmentId
      await register(payload)
      setSuccess('User registered successfully')
      setForm({ name: '', email: '', password: '', role: 'RECRUITER', departmentId: '' })
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Unable to register user'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1>Create a user</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Name</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{ padding: 8 }}
          />
        </label>
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
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Role</span>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as RegisterFormState['role'] })}
            style={{ padding: 8 }}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Department</span>
          <select
            value={form.departmentId}
            onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
            style={{ padding: 8 }}
            disabled={departmentsLoading}
          >
            <option value="">Unassigned</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {departmentsError && <span style={{ color: 'crimson' }}>Unable to load departments.</span>}
        </label>
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Creating…' : 'Create user'}
        </button>
      </form>
    </div>
  )
}
