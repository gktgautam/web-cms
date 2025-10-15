import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  archiveJob,
  getJob,
  publishJob,
  requestJobReview,
  restoreJob,
  unpublishJob,
  Job,
  JobStatus
} from '../api';

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    return error.response?.data?.error || 'Action failed';
  }
  return 'Action failed';
};

const canRequestReview = (status: JobStatus) => status === 'DRAFT';
const canPublish = (status: JobStatus) => status === 'DRAFT' || status === 'REVIEW';
const canUnpublish = (status: JobStatus) => status === 'PUBLISHED';
const canArchive = (status: JobStatus) => status !== 'ARCHIVED';
const canRestore = (status: JobStatus) => status === 'ARCHIVED';

const useJobAction = (
  jobId: string | undefined,
  action: (jobId: string) => Promise<Job>,
  onSuccess: (job: Job) => void,
  onError: (error: unknown) => void
) =>
  useMutation({
    mutationFn: async () => {
      if (!jobId) {
        throw new Error('Missing job id');
      }
      return action(jobId);
    },
    onSuccess,
    onError
  });

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const jobQuery = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id as string),
    enabled: Boolean(id)
  });

  const invalidate = (job: Job) => {
    queryClient.invalidateQueries({ queryKey: ['jobs'] });
    queryClient.invalidateQueries({ queryKey: ['publicJobs'] });
    queryClient.setQueryData(['job', job.id], job);
  };

  const handleActionSuccess = (job: Job) => {
    setActionError(null);
    invalidate(job);
  };

  const handleActionError = (error: unknown) => {
    setActionError(getErrorMessage(error));
  };

  const reviewMutation = useJobAction(id, requestJobReview, handleActionSuccess, handleActionError);
  const publishMutation = useJobAction(id, publishJob, handleActionSuccess, handleActionError);
  const unpublishMutation = useJobAction(id, unpublishJob, handleActionSuccess, handleActionError);
  const archiveMutation = useJobAction(id, archiveJob, handleActionSuccess, handleActionError);
  const restoreMutation = useJobAction(id, restoreJob, handleActionSuccess, handleActionError);

  if (!id) {
    return <p>Missing job id</p>;
  }

  if (jobQuery.isLoading) {
    return <p>Loading…</p>;
  }

  if (jobQuery.isError || !jobQuery.data) {
    return <p>Job not found.</p>;
  }

  const job = jobQuery.data;
  const publicLink = job.status === 'PUBLISHED' ? `/jobs/${job.slug}` : null;

  const isActing =
    reviewMutation.isPending ||
    publishMutation.isPending ||
    unpublishMutation.isPending ||
    archiveMutation.isPending ||
    restoreMutation.isPending;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px' }}>{job.title}</h1>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#eef2ff',
            color: '#3730a3',
            padding: '4px 8px',
            borderRadius: 999
          }}>
            Status: {job.status}
          </span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => navigate(`/dashboard/jobs/${job.id}/edit`)}
            style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #cbd5f5', background: '#fff' }}
          >
            Edit
          </button>
          {publicLink && (
            <Link
              to={publicLink}
              style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #2563eb', color: '#2563eb' }}
              target="_blank"
              rel="noreferrer"
            >
              View public page
            </Link>
          )}
        </div>
      </header>

      <section style={{ display: 'grid', gap: 8 }}>
        <div style={{ color: '#4b5563' }}>
          <strong>Department:</strong> {job.department?.name}
        </div>
        <div style={{ color: '#4b5563' }}>
          <strong>Location:</strong> {job.location}
        </div>
        <div style={{ color: '#4b5563' }}>
          <strong>Employment type:</strong> {job.employmentType}
        </div>
        <div style={{ color: '#4b5563' }}>
          <strong>Slug:</strong> {job.slug}
        </div>
        {job.publishedAt && (
          <div style={{ color: '#4b5563' }}>
            <strong>Published:</strong> {formatDate(job.publishedAt)}
          </div>
        )}
        <div style={{ color: '#4b5563' }}>
          <strong>Created:</strong> {formatDate(job.createdAt)}
        </div>
        <div style={{ color: '#4b5563' }}>
          <strong>Updated:</strong> {formatDate(job.updatedAt)}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 8 }}>Description</h2>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f9fafb', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' }}>
          {job.description}
        </pre>
      </section>

      <section style={{ display: 'grid', gap: 8 }}>
        <h2 style={{ margin: 0 }}>Actions</h2>
        {actionError && <p style={{ color: 'crimson', margin: 0 }}>{actionError}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {canRequestReview(job.status) && (
            <button
              type="button"
              onClick={() => reviewMutation.mutate()}
              disabled={isActing}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #2563eb', background: '#2563eb', color: '#fff' }}
            >
              Submit for review
            </button>
          )}
          {canPublish(job.status) && (
            <button
              type="button"
              onClick={() => publishMutation.mutate()}
              disabled={isActing}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #059669', background: '#059669', color: '#fff' }}
            >
              Publish
            </button>
          )}
          {canUnpublish(job.status) && (
            <button
              type="button"
              onClick={() => unpublishMutation.mutate()}
              disabled={isActing}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #f59e0b', background: '#fef3c7', color: '#b45309' }}
            >
              Unpublish
            </button>
          )}
          {canArchive(job.status) && (
            <button
              type="button"
              onClick={() => archiveMutation.mutate()}
              disabled={isActing}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #dc2626', background: '#fee2e2', color: '#b91c1c' }}
            >
              Archive
            </button>
          )}
          {canRestore(job.status) && (
            <button
              type="button"
              onClick={() => restoreMutation.mutate()}
              disabled={isActing}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #2563eb', background: '#fff', color: '#2563eb' }}
            >
              Restore to draft
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
