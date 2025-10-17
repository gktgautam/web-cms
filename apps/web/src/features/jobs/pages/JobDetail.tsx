import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
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
<div className="grid gap-4">
  {/* Header */}
  <header className="flex flex-wrap items-center gap-3">
    <div>
      <h1 className="text-xl font-semibold mb-1">{job.title}</h1>
      <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
        Status: {job.status}
      </span>
    </div>

    <div className="ml-auto flex gap-2">
      <button
        type="button"
        onClick={() => navigate(`/dashboard/jobs/${job.id}/edit`)}
        className="px-3 py-1.5 rounded-md border border-indigo-200 bg-white hover:bg-indigo-50"
      >
        Edit
      </button>

      {publicLink && (
        <Link
          to={publicLink}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          View public page
        </Link>
      )}
    </div>
  </header>

  {/* Job details */}
  <section className="grid gap-2 text-gray-600">
    <div>
      <strong>Department:</strong> {job.department?.name}
    </div>
    <div>
      <strong>Location:</strong> {job.location}
    </div>
    <div>
      <strong>Employment type:</strong> {job.employmentType}
    </div>
    <div>
      <strong>Slug:</strong> {job.slug}
    </div>
    {job.publishedAt && (
      <div>
        <strong>Published:</strong> {formatDate(job.publishedAt)}
      </div>
    )}
    <div>
      <strong>Created:</strong> {formatDate(job.createdAt)}
    </div>
    <div>
      <strong>Updated:</strong> {formatDate(job.updatedAt)}
    </div>
  </section>

  {/* Description */}
  <section>
    <h2 className="mb-2 text-lg font-medium">Description</h2>
     <article className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }}></article>
  </section>

  {/* Actions */}
  <section className="grid gap-2">
    <h2 className="m-0 text-lg font-medium">Actions</h2>
    {actionError && <p className="text-red-600 m-0">{actionError}</p>}

    <div className="flex flex-wrap gap-2">
      {canRequestReview(job.status) && (
        <button
          type="button"
          onClick={() => reviewMutation.mutate()}
          disabled={isActing}
          className="px-3 py-2 rounded-md border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Submit for review
        </button>
      )}

      {canPublish(job.status) && (
        <button
          type="button"
          onClick={() => publishMutation.mutate()}
          disabled={isActing}
          className="px-3 py-2 rounded-md border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Publish
        </button>
      )}

      {canUnpublish(job.status) && (
        <button
          type="button"
          onClick={() => unpublishMutation.mutate()}
          disabled={isActing}
          className="px-3 py-2 rounded-md border border-amber-500 bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-50"
        >
          Unpublish
        </button>
      )}

      {canArchive(job.status) && (
        <button
          type="button"
          onClick={() => archiveMutation.mutate()}
          disabled={isActing}
          className="px-3 py-2 rounded-md border border-red-600 bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
        >
          Archive
        </button>
      )}

      {canRestore(job.status) && (
        <button
          type="button"
          onClick={() => restoreMutation.mutate()}
          disabled={isActing}
          className="px-3 py-2 rounded-md border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 disabled:opacity-50"
        >
          Restore to draft
        </button>
      )}
    </div>
  </section>
</div>

  );
}
