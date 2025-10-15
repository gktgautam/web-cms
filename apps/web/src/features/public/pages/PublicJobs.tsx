import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import { Link } from 'react-router-dom'

export default function PublicJobs() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['publicJobs'],
    queryFn: async () => (await api.get('/public/jobs')).data,
  })

  if (isLoading) {
    return <div className="py-20 text-center text-slate-300">Loading open positions…</div>
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-light/70">Join Logelin</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Open roles</h1>
        <p className="mt-3 text-sm text-slate-300">
          We build the future of content at Logelin. Browse the openings below and explore the detailed job page for more
          information.
        </p>
      </div>

      <div className="grid gap-4">
        {data.map((job: any) => (
          <article
            key={job.id}
            className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 shadow-lg shadow-slate-950/40 transition hover:border-white/20 hover:shadow-slate-900/60"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{job.title}</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {job.department?.name} · {job.location} · {job.employmentType}
                </p>
              </div>
              <Link
                to={`/jobs/${job.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-brand-light hover:text-white"
              >
                View role
                <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}