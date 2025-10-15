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

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 720, display: 'grid', gap: 12 }}>
      <h1 style={{ marginBottom: 4 }}>{submitLabel}</h1>
      {error && <p style={{ color: 'crimson', margin: 0 }}>{error}</p>}
      <label style={{ display: 'grid', gap: 4 }}>
        <span style={{ fontWeight: 600 }}>Title</span>
        <input
          required
          value={values.title}
          onChange={handleChange('title')}
          disabled={submitting}
          placeholder="Role title"
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </label>
      <label style={{ display: 'grid', gap: 4 }}>
        <span style={{ fontWeight: 600 }}>Department</span>
        <select
          required
          value={values.departmentId}
          onChange={handleChange('departmentId')}
          disabled={submitting || loadingDepartments || departments.length === 0}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
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
          <span style={{ color: '#666', fontSize: 12 }}>Create a department first to assign this job.</span>
        )}
      </label>
      <label style={{ display: 'grid', gap: 4 }}>
        <span style={{ fontWeight: 600 }}>Location</span>
        <input
          required
          value={values.location}
          onChange={handleChange('location')}
          disabled={submitting}
          placeholder="e.g. Remote, Berlin"
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </label>
      <label style={{ display: 'grid', gap: 4 }}>
        <span style={{ fontWeight: 600 }}>Employment type</span>
        <input
          required
          value={values.employmentType}
          onChange={handleChange('employmentType')}
          disabled={submitting}
          placeholder="Full-time, Contract, etc."
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </label>
      <label style={{ display: 'grid', gap: 4 }}>
        <span style={{ fontWeight: 600 }}>Description</span>
        <textarea
          required
          value={values.description}
          onChange={handleChange('description')}
          disabled={submitting}
          placeholder="Describe the opportunity…"
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minHeight: 200, resize: 'vertical' }}
        />
      </label>
      <button
        type="submit"
        disabled={submitting || loadingDepartments || departments.length === 0}
        style={{
          padding: '10px 16px',
          borderRadius: 6,
          border: 'none',
          background: submitting ? '#999' : '#2563eb',
          color: '#fff',
          cursor: submitting ? 'not-allowed' : 'pointer'
        }}
      >
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
