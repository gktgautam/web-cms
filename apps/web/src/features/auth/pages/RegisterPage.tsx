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
    <div className='flex items-center justify-center h-full flex-grow'>
      <div className='p-10 bg-gray-100 min-w-[400px]'>
      <h1 className='text-2xl font-bold'>Create a user</h1>
      {error && <p className='text-red-500'>{error}</p>}
      {success && <p className='text-green-500'>{success}</p>}

      <form onSubmit={onSubmit} className='grid gap-3 mt-5'>
         <div>
           <label className='field-label'>Name</label>
           <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className='input' />
        </div>

        <div>
          <label className='field-label'>Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required className='input' />
        </div>

        <div>
          <label className='field-label'>Password</label>
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required className='input' />
        </div>

        <div>
          <label className='field-label'>Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as RegisterFormState['role'] })} className='input'>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.replace('_', ' ')}
              </option>
            ))}
          </select> 
        </div>

        <div>
          <label className='field-label'>Department</label>
          <select
            value={form.departmentId}
            onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
            className='input'
            disabled={departmentsLoading}
          >
            <option value="">Unassigned</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {departmentsError && <p className='text-red-500'>Unable to load departments.</p>}
        </div>
         
     
        <button type="submit" disabled={loading} className='btn btn-primary-animated mt-3'>
          {loading ? 'Creating…' : 'Create user'}
        </button>
      </form>
    </div>
   </div>
  )
}
