import { FormEvent, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../../lib/api'

type Department = { id: string; name: string }

type JobForm = {
  title: string
  description: string
  location: string
  employmentType: string
  departmentId: string
}

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']

export default function JobNew() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState<JobForm>({
    title: '',
    description: '',
    location: '',
    employmentType: employmentTypes[0],
    departmentId: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const { data: departments = [], isLoading: loadingDepartments } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => (await api.get('/departments')).data,
  })

  useEffect(() => {
    if (!form.departmentId && departments.length > 0) {
      setForm((prev) => ({ ...prev, departmentId: departments[0].id }))
    }
  }, [departments, form.departmentId])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(undefined)

    try {
      await api.post('/jobs', form)
      await queryClient.invalidateQueries({ queryKey: ['jobs'] })
      navigate('/dashboard/jobs')
    } catch (err: any) {
      const response = err?.response?.data
      const fieldErrors = response?.fieldErrors
        ? Object.values(response.fieldErrors as Record<string, string[]>).flat().join(', ')
        : undefined
      const responseError =
        response?.error ||
        (Array.isArray(response?.formErrors) ? response.formErrors.join(', ') : undefined) ||
        fieldErrors ||
        'Something went wrong. Please try again.'
      setError(responseError)
    } finally {
      setLoading(false)
    }
  }

  const inputClasses =
    'w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 transition'

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-200">New role</p>
        <h1 className="text-3xl font-semibold text-white">Create job</h1>
        <p className="text-sm text-white/60">
          Draft a compelling role description and collaborate with hiring managers before publishing.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-white/80">Job title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="e.g. Senior Product Designer"
              className={inputClasses}
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-white/80">Location</span>
            <input
              value={form.location}
              onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
              placeholder="Remote · North America"
              className={inputClasses}
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-white/80">Employment type</span>
            <select
              value={form.employmentType}
              onChange={(event) => setForm((prev) => ({ ...prev, employmentType: event.target.value }))}
              className={inputClasses}
            >
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-white/80">Department</span>
            <select
              value={form.departmentId}
              onChange={(event) => setForm((prev) => ({ ...prev, departmentId: event.target.value }))}
              className={inputClasses}
              disabled={loadingDepartments}
              required
            >
              <option value="" disabled>
                {loadingDepartments ? 'Loading departments…' : 'Select a department'}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          <p className="text-white/90">Tips for a standout listing</p>
          <ul className="mt-3 space-y-2 list-disc pl-4">
            <li>Start with an impact statement about the role.</li>
            <li>List the top three outcomes expected in the first 90 days.</li>
            <li>Highlight growth opportunities and collaboration touchpoints.</li>
          </ul>
        </aside>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-white/80">Description</span>
        <textarea
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Share the mission, responsibilities, and ideal teammate profile."
          className={`${inputClasses} min-h-[240px] resize-y`}
          required
        />
      </label>

      <div className="flex flex-col gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/10 p-5 text-sm text-white/80">
        <p className="text-white">Collaboration settings</p>
        <p>
          Drafts stay private to your hiring team. Publish when the description, compensation, and interview plan are ready.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Link
          to="/dashboard/jobs"
          className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10"
        >
          Cancel
        </Link>
        <button
          className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(77,125,255,0.25)] transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading || loadingDepartments}
        >
          {loading ? 'Saving…' : 'Save draft'}
        </button>
      </div>
    </form>
  )
}
