import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../../lib/api';
import { PageContainer } from '../../../components/PageContainer';

type JobDetails = {
  title: string;
  location: string;
  employmentType: string;
  description: string;
};

export default function JobPublic() {
  const { slug } = useParams();
  const {
    data,
    isLoading,
    isError
  } = useQuery<JobDetails>({
    queryKey: ['jobPublic', slug],
    queryFn: async () => (await api.get(`/public/jobs/${slug}`)).data,
    enabled: Boolean(slug)
  });

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <Link to="/" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          ← Back to all roles
        </Link>
      </div>

      {isLoading && <p className="text-slate-600">Loading role…</p>}
      {isError && <p className="text-red-500">We couldn&apos;t find that role.</p>}

      {!isLoading && !isError && data && (
        <article className="space-y-4">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">{data.title}</h1>
            <p className="text-sm text-slate-600">
              {data.location} · {data.employmentType}
            </p>
          </header>
          <div className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-700 shadow-sm">
            {data.description}
          </div>
        </article>
      )}
    </PageContainer>
  );
}
