import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../../../lib/api'

type PublicJob = {
  id: string
  title: string
  slug: string
  location: string
  employmentType: string
  department?: { name: string }
  publishedAt?: string
}

export default function PublicJobs() {
  const { data = [], isLoading } = useQuery<PublicJob[]>({
    queryKey: ['publicJobs'],
    queryFn: async () => (await api.get('/public/jobs')).data,
  })

  return (
    <div className="space-y-16">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-12 text-white shadow-[0_10px_40px_rgba(77,125,255,0.25)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-brand-200">We're hiring</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Build products that help teams hire brilliantly
            </h1>
            <p className="text-lg text-white/70">
              Join a multidisciplinary team shipping inclusive hiring tools used by high-growth startups and global brands.
              We pair autonomy with mentorship so you can do your life's best work.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-sm text-white/80 backdrop-blur">
            <p className="text-white/90">Why AstraHire?</p>
            <ul className="space-y-2 text-white/60">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" aria-hidden />
                Remote-first culture with quarterly in-person meetups
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" aria-hidden />
                Generous learning stipend and mentorship budget
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" aria-hidden />
                Inclusive benefits that support you and your family
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Open roles</h2>
            <p className="text-sm text-white/60">{data.length} positions across product, engineering, and operations.</p>
          </div>
          <Link
            to="/dashboard/jobs"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10"
          >
            Hiring team sign in
          </Link>
        </div>

        <div className="mt-10 grid gap-5">
          {isLoading && (
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-white/5 bg-slate-900/70 p-6 shadow-inner shadow-black/10 backdrop-blur animate-pulse"
                >
                  <div className="h-5 w-1/2 rounded-full bg-white/10" />
                  <div className="mt-4 h-4 w-2/3 rounded-full bg-white/5" />
                  <div className="mt-6 h-10 rounded-2xl bg-white/5" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && data.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-12 text-center backdrop-blur">
              <div className="rounded-full bg-brand-500/10 p-4 text-brand-200">✨</div>
              <p className="text-lg font-semibold text-white">We're heads down right now</p>
              <p className="max-w-md text-sm text-white/60">
                There are no open roles at this time. Join our talent network to be the first to hear about new opportunities.
              </p>
              <button className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(77,125,255,0.25)] transition hover:bg-brand-400">
                Join talent network
              </button>
            </div>
          )}

          {!isLoading && data.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {data.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.slug}`}
                  className="group flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-brand-400/40 hover:bg-slate-900/60"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-brand-200">{job.department?.name ?? 'Team'}</p>
                      <h3 className="mt-2 text-xl font-semibold text-white group-hover:text-brand-200">{job.title}</h3>
                    </div>
                    {job.publishedAt && (
                      <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-100">
                        Posted {new Date(job.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/60">{job.location} · {job.employmentType}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand-100">View details</span>
                    <span aria-hidden className="text-brand-300 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
