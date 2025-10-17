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
    return <p className="text-sm text-red-500">Missing job id</p>;
  }

  if (jobQuery.isLoading) {
    return <p className="text-slate-600">Loading…</p>;
  }

  if (jobQuery.isError || !jobQuery.data) {
    return <p className="text-red-500">Job not found.</p>;
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
    <div className="grid gap-10">
      <header className="flex flex-wrap items-center gap-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
            Status: {job.status}
          </span>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/jobs/${job.id}/edit`)}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </button>
          {publicLink && (
            <Link
              to={publicLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              View public page
            </Link>
          )}
        </div>
      </header>

      <section className="grid gap-3 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-900">Department:</span> {job.department?.name || 'Unassigned'}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Location:</span> {job.location}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Employment type:</span> {job.employmentType}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Slug:</span> {job.slug}
        </p>
        {job.publishedAt && (
          <p>
            <span className="font-semibold text-slate-900">Published:</span> {formatDate(job.publishedAt)}
          </p>
        )}
        <p>
          <span className="font-semibold text-slate-900">Created:</span> {formatDate(job.createdAt)}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Updated:</span> {formatDate(job.updatedAt)}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Description</h2>
        <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-700 shadow-sm">
          {job.description}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Actions</h2>
        {actionError && <p className="text-sm text-red-500">{actionError}</p>}
        <div className="flex flex-wrap gap-3">
          {canRequestReview(job.status) && (
            <button
              type="button"
              onClick={() => reviewMutation.mutate()}
              disabled={isActing}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Submit for review
            </button>
          )}
          {canPublish(job.status) && (
            <button
              type="button"
              onClick={() => publishMutation.mutate()}
              disabled={isActing}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Publish
            </button>
          )}
          {canUnpublish(job.status) && (
            <button
              type="button"
              onClick={() => unpublishMutation.mutate()}
              disabled={isActing}
              className="rounded-full border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Unpublish
            </button>
          )}
          {canArchive(job.status) && (
            <button
              type="button"
              onClick={() => archiveMutation.mutate()}
              disabled={isActing}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Archive
            </button>
          )}
          {canRestore(job.status) && (
            <button
              type="button"
              onClick={() => restoreMutation.mutate()}
              disabled={isActing}
              className="rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Restore
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
