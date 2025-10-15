import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import { Link, useParams } from 'react-router-dom'

export default function JobPublic() {
  const { slug } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobPublic', slug],
    queryFn: async () => (await api.get(`/public/jobs/${slug}`)).data,
    enabled: !!slug,
  })

  if (isLoading) {
    return <div className="py-20 text-center text-slate-300">Loading role details…</div>
  }

  if (error || !data) {
    return (
      <div className="space-y-6 text-center">
        <p className="text-lg font-semibold text-white">This opportunity has moved.</p>
        <Link to="/" className="text-sm font-medium text-brand-light hover:text-brand">
          Back to open roles
        </Link>
      </div>
    )
  }

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-light/70">Logelin · {data.department?.name}</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{data.title}</h1>
        <p className="mt-2 text-sm text-slate-300">
          {data.location} · {data.employmentType}
        </p>
      </div>
      <div className="space-y-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/50 p-6 text-sm leading-6 text-slate-200 shadow-lg shadow-slate-950/40">
        {data.description}
      </div>
      <Link
        to="/"
        className="self-start rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand-light transition hover:bg-brand/10"
      >
        Back to listings
      </Link>
    </article>
  )
}