import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { Job, JobStatus, listJobs } from '../api';

const statusOptions: Array<{ value: JobStatus | ''; label: string }> = [
  { value: '', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'REVIEW', label: 'In review' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' }
];

const statusStyles: Record<JobStatus, { background: string; color: string }> = {
  DRAFT: { background: '#f3f4f6', color: '#374151' },
  REVIEW: { background: '#eef2ff', color: '#4338ca' },
  PUBLISHED: { background: '#dcfce7', color: '#047857' },
  ARCHIVED: { background: '#fee2e2', color: '#b91c1c' }
};

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    return error.response?.data?.error || 'Failed to load jobs';
  }
  return 'Failed to load jobs';
};

export default function JobsList() {
  const [statusFilter, setStatusFilter] = useState<JobStatus | ''>('');

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['jobs', { status: statusFilter }],
    queryFn: () => listJobs({ status: statusFilter || undefined })
  });

  const jobs = data?.items ?? [];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Jobs</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as JobStatus | '')}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db' }}
        >
          {statusOptions.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff' }}
        >
          Refresh
        </button>
        <Link
          to="/dashboard/jobs/new"
          style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: 6, background: '#2563eb', color: '#fff' }}
        >
          + New job
        </Link>
      </header>

      {isLoading && <p>Loading…</p>}
      {error && <p style={{ color: 'crimson' }}>{getErrorMessage(error)}</p>}

      {!isLoading && jobs.length === 0 && <p>No jobs found.</p>}

      <div style={{ display: 'grid', gap: 12 }}>
        {jobs.map((job: Job) => (
          <article
            key={job.id}
            style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, display: 'grid', gap: 8 }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <h2 style={{ margin: 0, flex: '1 1 auto' }}>{job.title}</h2>
              <span
                style={{
                  padding: '4px 8px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  background: statusStyles[job.status].background,
                  color: statusStyles[job.status].color
                }}
              >
                {job.status}
              </span>
            </div>
            <div style={{ color: '#4b5563' }}>
              {job.department?.name} · {job.location} · {job.employmentType}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link to={`/dashboard/jobs/${job.id}`} style={{ color: '#2563eb' }}>
                Manage
              </Link>
              {job.status === 'PUBLISHED' ? (
                <Link to={`/jobs/${job.slug}`} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
                  Public page
                </Link>
              ) : (
                <span style={{ color: '#9ca3af' }}>Not public</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
