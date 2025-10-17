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
    <div className='grid gap-4 p-10'>
      <div className='flex flex-wrap gap-3 items-center'>
        <h1 className='m-0'>Jobs</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as JobStatus | '')}
          className='p-1 border border-gray-300 rounded'
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
          className='p-1 border border-gray-300 rounded bg-white'
        >
          Refresh
        </button>
        <Link
          to="/dashboard/jobs/new"
          className='ml-auto p-2 rounded bg-blue-600 text-white'
        >
          + New job
        </Link>
      </div>

      {isLoading && <p>Loading…</p>}
      {error && <p className='text-red-500'>{getErrorMessage(error)}</p>}

      {!isLoading && jobs.length === 0 && <p>No jobs found.</p>}

      <div className='grid gap-3'>
        {jobs.map((job: Job) => (
          <article
            key={job.id}
            className='border border-gray-300 rounded-lg p-4'
          >
            <div className='flex flex-wrap gap-2 items-center'>
              <h2 className='m-0 flex-1'>{job.title}</h2>
              <span className='px-2 py-1 rounded-full text-sm font-medium' style={statusStyles[job.status]}>
                {job.status}
              </span>
            </div>
            <div className='text-gray-600'>{job.department?.name} · {job.location} · {job.employmentType}</div>
            <div className='flex flex-wrap gap-3'>
              <Link to={`/dashboard/jobs/${job.id}`} className='text-blue-600'>
                Manage
              </Link>
              {job.status === 'PUBLISHED' ? (
                <Link to={`/jobs/${job.slug}`} target="_blank" rel="noreferrer" className='text-blue-600'>
                  Public page
                </Link>
              ) : (
                <span className='text-gray-400'>Not public</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
