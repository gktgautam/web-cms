import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import { Link } from 'react-router-dom'

export default function JobsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => (await api.get('/jobs')).data,
  })

  if (isLoading) {
    return <div className="py-20 text-center text-slate-300">Loading the dashboard…</div>
  }

  if (error) {
    return <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-sm text-rose-200">Failed to load jobs.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Jobs overview</h1>
          <p className="text-sm text-slate-300">Manage the openings that Logelin has published for the team.</p>
        </div>
        <Link
          to="/dashboard/jobs/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-light"
        >
          Create job
          <span aria-hidden>+</span>
        </Link>
      </div>

      <div className="grid gap-4">
        {data?.items?.map((job: any) => (
          <article
            key={job.id}
            className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 shadow-lg shadow-slate-950/40 transition hover:border-white/20 hover:shadow-slate-900/60"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{job.title}</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {job.department?.name} · {job.location} · {job.status}
                </p>
              </div>
              <Link
                to={`/jobs/${job.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-brand-light hover:text-white"
              >
                Public page
                <span aria-hidden>↗</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}