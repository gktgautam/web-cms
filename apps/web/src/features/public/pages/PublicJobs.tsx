import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api';
import { PageContainer } from '../../../components/PageContainer';

type PublicJob = {
  id: string;
  title: string;
  slug: string;
  location: string;
  employmentType: string;
  department?: { name?: string | null } | null;
};

export default function PublicJobs() {
  const { data = [], isLoading, isError } = useQuery<PublicJob[]>({
    queryKey: ['publicJobs'],
    queryFn: async () => (await api.get('/public/jobs')).data
  });

  return (
    <PageContainer className="flex flex-col gap-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Open roles</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Explore the opportunities currently available at Equentis. We publish each opening with clear details about the team,
          location, and employment type.
        </p>
      </header>

      {isLoading && <p className="text-slate-600">Loading jobs…</p>}
      {isError && <p className="text-red-500">Unable to load jobs right now. Please try again later.</p>}

      {!isLoading && !isError && data.length === 0 && (
        <p className="text-slate-500">No open roles at the moment. Please check back soon.</p>
      )}

      <div className="grid gap-4">
        {data.map((job) => (
          <article
            key={job.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">{job.title}</h2>
              <span className="text-sm font-medium text-blue-700">
                {job.department?.name ? job.department.name : 'General'}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {job.location} · {job.employmentType}
            </p>
            <div className="mt-4">
              <Link to={`/jobs/${job.slug}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageContainer>
  );
}
