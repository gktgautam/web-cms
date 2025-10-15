import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../../../lib/api'
import { useDebounce } from '../../../lib/useDebounce'

type Department = { id: string; name: string }

type Job = {
  id: string
  title: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED'
  location: string
  employmentType: string
  createdAt: string
  department?: { name: string }
}

type JobsResponse = {
  items: Job[]
  total: number
  page: number
}

const statusDisplay: Record<Job['status'], { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30' },
  PUBLISHED: { label: 'Published', className: 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30' },
}

const limit = 8

export default function JobsList() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('')
  const [department, setDepartment] = useState<string>('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 400)
  const queryClient = useQueryClient()

  const filters = useMemo(
    () => ({ page, status, department, q: debouncedSearch }),
    [page, status, department, debouncedSearch],
  )

  const { data, isLoading, isError } = useQuery<JobsResponse>({
    queryKey: ['jobs', filters],
    queryFn: async () =>
      (
        await api.get('/jobs', {
          params: {
            page,
            limit,
            status: status || undefined,
            dept: department || undefined,
            q: debouncedSearch || undefined,
          },
        })
      ).data,
    keepPreviousData: true,
  })

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => (await api.get('/departments')).data,
  })

  const totalPages = data ? Math.max(1, Math.ceil(data.total / limit)) : 1

  const publishJob = async (id: string) => {
    await api.post(`/jobs/${id}/publish`)
    queryClient.invalidateQueries({ queryKey: ['jobs'] })
  }

  const inputClasses =
    'w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 transition'

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Hiring pipeline</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Openings</h1>
          <p className="mt-2 text-sm text-white/60">Monitor drafts, publish roles, and share links with hiring managers.</p>
        </div>
        <Link
          to="/dashboard/jobs/new"
          className="self-start inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(77,125,255,0.25)] transition hover:bg-brand-400"
        >
          Create new role
        </Link>
      </header>

      <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-white/70">Search roles</span>
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Search by title or description"
              className={inputClasses}
              type="search"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-white/70">Status</span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
              className={inputClasses}
            >
              <option value="">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-white/70">Department</span>
            <select
              value={department}
              onChange={(event) => {
                setDepartment(event.target.value)
                setPage(1)
              }}
              className={inputClasses}
            >
              <option value="">All departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Active roles" value={data?.items.filter((job) => job.status === 'PUBLISHED').length ?? 0} />
          <StatCard label="Drafts" value={data?.items.filter((job) => job.status === 'DRAFT').length ?? 0} />
          <StatCard label="Total roles" value={data?.total ?? 0} />
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left">
            <thead className="text-xs uppercase tracking-widest text-white/40">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-white/80">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-10">
                    <div className="flex animate-pulse flex-col gap-3">
                      <div className="h-4 w-1/3 rounded-full bg-white/10" />
                      <div className="h-4 w-1/2 rounded-full bg-white/5" />
                      <div className="h-4 w-2/3 rounded-full bg-white/5" />
                    </div>
                  </td>
                </tr>
              )}

              {isError && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-rose-200">
                    Failed to load jobs. Refresh to try again.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && data && data.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-white/60">
                    No jobs match your filters.
                  </td>
                </tr>
              )}

              {data?.items.map((job) => {
                const statusInfo = statusDisplay[job.status]
                return (
                  <tr key={job.id} className="transition hover:bg-white/5">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-white">{job.title}</div>
                      <div className="text-xs text-white/50">
                        Updated {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5">{job.department?.name}</td>
                    <td className="px-6 py-5">{job.location}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/jobs/${job.slug}`}
                          className="inline-flex items-center justify-center rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10"
                        >
                          View public page
                        </Link>
                        {job.status === 'DRAFT' && (
                          <button
                            onClick={() => publishJob(job.id)}
                            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_30px_rgba(77,125,255,0.25)] transition hover:bg-brand-400"
                          >
                            Publish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-6 py-5 text-xs text-white/60">
          <span>
            Page {data?.page ?? page} of {totalPages}
          </span>
          <div className="flex gap-3">
            <button
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}
