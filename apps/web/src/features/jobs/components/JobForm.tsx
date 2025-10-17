import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_JOB_FORM, JobFormValues, getDepartments } from '../api';

interface JobFormProps {
  initialValues?: JobFormValues;
  onSubmit: (values: JobFormValues) => void;
  submitting?: boolean;
  error?: string | null;
  submitLabel?: string;
}

export function JobForm({ initialValues = DEFAULT_JOB_FORM, onSubmit, submitting, error, submitLabel = 'Save' }: JobFormProps) {
  const { data: departments = [], isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments
  });
  const [values, setValues] = useState<JobFormValues>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (
    field: keyof JobFormValues
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(values);
  };

  const disabled = submitting || loadingDepartments || departments.length === 0;

  return (
    <form onSubmit={handleSubmit} className="grid max-w-2xl gap-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{submitLabel}</h1>
        <p className="mt-1 text-sm text-slate-600">Fill out the job details and publish when you&apos;re ready.</p>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <label className="grid gap-2">
        <span className="field-label">Title</span>
        <input
          required
          value={values.title}
          onChange={handleChange('title')}
          disabled={submitting}
          placeholder="Role title"
          className="input"
        />
      </label>
      <label className="grid gap-2">
        <span className="field-label">Department</span>
        <select
          required
          value={values.departmentId}
          onChange={handleChange('departmentId')}
          disabled={submitting || loadingDepartments || departments.length === 0}
          className="input"
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
        {!loadingDepartments && departments.length === 0 && (
          <span className="text-sm text-slate-500">Create a department first to assign this job.</span>
        )}
      </label>
      <label className="grid gap-2">
        <span className="field-label">Location</span>
        <input
          required
          value={values.location}
          onChange={handleChange('location')}
          disabled={submitting}
          placeholder="e.g. Remote, Berlin"
          className="input"
        />
      </label>
      <label className="grid gap-2">
        <span className="field-label">Employment type</span>
        <input
          required
          value={values.employmentType}
          onChange={handleChange('employmentType')}
          disabled={submitting}
          placeholder="Full-time, Contract, etc."
          className="input"
        />
      </label>
      <label className="grid gap-2">
        <span className="field-label">Description</span>
        <textarea
          required
          value={values.description}
          onChange={handleChange('description')}
          disabled={submitting}
          placeholder="Describe the opportunity…"
          className="input min-h-[200px] resize-y"
        />
      </label>
      <button
        type="submit"
        disabled={disabled}
        className="btn btn-primary-animated mt-2 w-fit disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
