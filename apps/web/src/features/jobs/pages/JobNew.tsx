import { ChangeEvent, FormEvent, useState } from 'react'
import { api } from '../../../lib/api'
import { useNavigate } from 'react-router-dom'

type JobFormState = {
  title: string
  description: string
  location: string
  employmentType: string
  departmentId: string
}

const initialState: JobFormState = {
  title: '',
  description: '',
  location: '',
  employmentType: '',
  departmentId: '',
}

export default function JobNew() {
  const navigate = useNavigate()
  const [form, setForm] = useState<JobFormState>(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(undefined)
    try {
      await api.post('/jobs', form)
      navigate('/dashboard/jobs')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create the job')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof JobFormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  return (
    <form className="mx-auto flex max-w-2xl flex-col gap-6" onSubmit={onSubmit}>
      <div>
        <h1 className="text-2xl font-semibold text-white">Create a new job</h1>
        <p className="mt-2 text-sm text-slate-300">Draft a role that will be visible to the Logelin hiring managers.</p>
      </div>

      {error && <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

      <div className="grid gap-4">
        <label className="space-y-2 text-sm font-medium text-slate-200">
          Job title
          <input
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            placeholder="Senior Frontend Engineer"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-brand"
            required
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-200">
          Description
          <textarea
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Share what makes this role at Logelin unique…"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand"
            rows={8}
            required
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-200">
            Location
            <input
              type="text"
              value={form.location}
              onChange={handleChange('location')}
              placeholder="Remote"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-brand"
              required
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-200">
            Employment type
            <input
              type="text"
              value={form.employmentType}
              onChange={handleChange('employmentType')}
              placeholder="Full-time"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-brand"
              required
            />
          </label>
        </div>
        <label className="space-y-2 text-sm font-medium text-slate-200">
          Department ID
          <input
            type="text"
            value={form.departmentId}
            onChange={handleChange('departmentId')}
            placeholder="clx123"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-brand"
            required
          />
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Saving…' : 'Save draft'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-slate-300 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}