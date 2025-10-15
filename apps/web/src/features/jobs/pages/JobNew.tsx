import { isAxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { JobForm } from '../components/JobForm';
import { DEFAULT_JOB_FORM, JobFormValues, createJob } from '../api';

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    return error.response?.data?.error || 'Failed to save job';
  }
  return 'Failed to save job';
};

export default function JobNew() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: JobFormValues) => createJob(values),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['publicJobs'] });
      navigate(`/dashboard/jobs/${job.id}`, { replace: true });
    }
  });

  return (
    <div>
      <JobForm
        initialValues={DEFAULT_JOB_FORM}
        onSubmit={(values) => mutation.mutate(values)}
        submitting={mutation.isPending}
        error={mutation.isError ? getErrorMessage(mutation.error) : null}
        submitLabel="Create job"
      />
    </div>
  );
}
