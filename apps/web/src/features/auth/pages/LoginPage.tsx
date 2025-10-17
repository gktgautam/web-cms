import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { PageContainer } from '../../../components/PageContainer';
import { useAuth } from '../AuthProvider';

type LocationState = {
  from?: Location;
};

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <NavigateAfterLogin />;
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form);
      const next = state?.from?.pathname || '/dashboard/jobs';
      navigate(next, { replace: true });
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Unable to sign in';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-1 text-sm text-slate-600">Use your admin or recruiter credentials to access the dashboard.</p>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="field-label">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="input"
            />
          </div>

          <div className="grid gap-2">
            <label className="field-label">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary-animated mt-2">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </PageContainer>
  );
}

function NavigateAfterLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/dashboard/jobs', { replace: true });
  }, [navigate]);
  return null;
}
