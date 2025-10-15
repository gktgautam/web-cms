import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../../lib/api'

type JobDetail = {
  id: string
  title: string
  slug: string
  description: string
  location: string
  employmentType: string
  department?: { name: string }
}

export default function JobPublic() {
  const { slug } = useParams()

  const {
    data,
    isLoading,
    error,
  } = useQuery<JobDetail>({
    queryKey: ['jobPublic', slug],
    queryFn: async () => (await api.get(`/public/jobs/${slug}`)).data,
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-10 backdrop-blur animate-pulse">
        <div className="h-10 w-2/3 rounded-full bg-white/10" />
        <div className="h-4 w-1/2 rounded-full bg-white/5" />
        <div className="h-[360px] rounded-3xl bg-white/5" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-12 text-center backdrop-blur">
        <p className="text-lg font-semibold text-white">This role is no longer available</p>
        <p className="text-sm text-white/60">Explore other openings or join our talent network to stay informed.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10"
          >
            View all openings
          </Link>
          <button className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(77,125,255,0.25)] transition hover:bg-brand-400">
            Join talent network
          </button>
        </div>
      </div>
    )
  }

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-10 text-white backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <header className="max-w-2xl space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">{data.department?.name ?? 'Team'}</p>
          <h1 className="text-4xl font-semibold tracking-tight">{data.title}</h1>
          <p className="text-base text-white/70">
            {data.location} · {data.employmentType}
          </p>
        </header>
        <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
          <p className="text-white/90">Hiring manager insights</p>
          <p>Share a portfolio or example project that showcases how you craft exceptional candidate experiences.</p>
          <Link
            to="/dashboard/jobs"
            className="inline-flex justify-center rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10"
          >
            Refer a teammate
          </Link>
        </div>
      </div>
      <div className="mt-10 space-y-10">
        {data.description
          .split('\n\n')
          .filter(Boolean)
          .map((block, idx) => (
            <p key={idx} className="text-lg leading-relaxed text-white/80">
              {block}
            </p>
          ))}
      </div>
      <div className="mt-12 flex flex-col gap-3 rounded-3xl bg-brand-500/10 p-8 text-white/90">
        <p className="text-lg font-semibold">Ready to apply?</p>
        <p className="text-sm text-white/70">
          Submit your resume and a short note about what excites you about AstraHire. Our team reviews applications twice a week.
        </p>
        <button className="mt-2 inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(77,125,255,0.25)] transition hover:bg-brand-400">
          Apply now
        </button>
      </div>
    </article>
  )
}
