import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { JobForm } from '../components/JobForm';
import { JobFormValues, getJob, updateJob } from '../api';

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    return error.response?.data?.error || 'Failed to update job';
  }
  return 'Failed to update job';
};

export default function JobEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const jobQuery = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id as string),
    enabled: Boolean(id)
  });

  const mutation = useMutation({
    mutationFn: (values: JobFormValues) => updateJob(id as string, values),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['publicJobs'] });
      queryClient.setQueryData(['job', id], job);
      navigate(`/dashboard/jobs/${job.id}`, { replace: true });
    }
  });

  if (!id) {
    return <p>Missing job id</p>;
  }

  if (jobQuery.isLoading) {
    return <p>Loading…</p>;
  }

  if (jobQuery.isError || !jobQuery.data) {
    return <p>Unable to load job.</p>;
  }

  const initialValues: JobFormValues = {
    title: jobQuery.data.title,
    description: jobQuery.data.description,
    location: jobQuery.data.location,
    employmentType: jobQuery.data.employmentType,
    departmentId: jobQuery.data.departmentId
  };

  return (
    <div>
      <JobForm
        initialValues={initialValues}
        onSubmit={(values) => mutation.mutate(values)}
        submitting={mutation.isPending}
        error={mutation.isError ? getErrorMessage(mutation.error) : null}
        submitLabel="Update job"
      />
    </div>
  );
}
