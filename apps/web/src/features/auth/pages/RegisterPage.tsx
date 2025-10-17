import { FormEvent, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageContainer } from '../../../components/PageContainer';
import { api } from '../../../lib/api';
import { useAuth } from '../AuthProvider';

const roles = ['ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'VIEWER'] as const;

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  role: (typeof roles)[number];
  departmentId: string;
};

type Department = {
  id: string;
  name: string;
};

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterFormState>({
    name: '',
    email: '',
    password: '',
    role: 'RECRUITER',
    departmentId: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError
  } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => (await api.get('/departments')).data
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      };
      if (form.departmentId) payload.departmentId = form.departmentId;
      await register(payload);
      setSuccess('User registered successfully');
      setForm({ name: '', email: '', password: '', role: 'RECRUITER', departmentId: '' });
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Unable to register user';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create a user</h1>
        <p className="mt-1 text-sm text-slate-600">
          Invite a teammate to collaborate on hiring. Assign a role and optional department access.
        </p>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        {success && <p className="mt-3 text-sm text-green-600">{success}</p>}

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="field-label">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="input"
            />
          </div>

          <div className="grid gap-2">
            <label className="field-label">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              required
              className="input"
            />
          </div>

          <div className="grid gap-2">
            <label className="field-label">Password</label>
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              required
              className="input"
            />
          </div>

          <div className="grid gap-2">
            <label className="field-label">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as RegisterFormState['role'] })}
              className="input"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="field-label">Department</label>
            <select
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              className="input"
              disabled={departmentsLoading}
            >
              <option value="">Unassigned</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {departmentsError && <p className="text-sm text-red-500">Unable to load departments.</p>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary-animated mt-2">
            {loading ? 'Creating…' : 'Create user'}
          </button>
        </form>
      </div>
    </PageContainer>
  );
}
