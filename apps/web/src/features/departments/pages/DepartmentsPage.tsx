import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { createDepartment, listDepartments } from '../api';

export default function DepartmentsPage() {
  const [name, setName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {
    data: departments = [],
    isLoading,
    error: listError
  } = useQuery({
    queryKey: ['departments'],
    queryFn: listDepartments
  });

  const hasListError = Boolean(listError);

  const {
    mutate: submitDepartment,
    isPending,
    error: createError
  } = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      setName('');
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    }
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError('Department name is required.');
      return;
    }

    submitDepartment({ name: trimmedName });
  };

  const renderCreateError = () => {
    if (!createError) return null;

    if (isAxiosError(createError)) {
      const message =
        createError.response?.data?.error ||
        createError.response?.data?.message ||
        createError.response?.data?.name?.[0];
      if (message) {
        return <p style={{ color: 'crimson', margin: 0 }}>{message}</p>;
      }
    }

    return <p style={{ color: 'crimson', margin: 0 }}>Unable to create department. Please try again.</p>;
  };

  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 720 }}>
      <header style={{ display: 'grid', gap: 4 }}>
        <h1 style={{ margin: 0 }}>Departments</h1>
        <p style={{ margin: 0, color: '#4b5563' }}>
          Create new departments to keep your job postings organised. Departments are also available when inviting new users.
        </p>
      </header>

      <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, display: 'grid', gap: 16 }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontWeight: 600 }}>Department name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (formError) {
                  setFormError(null);
                }
              }}
              disabled={isPending}
              placeholder="e.g. Marketing"
              style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
            />
          </label>

          {formError && <p style={{ color: 'crimson', margin: 0 }}>{formError}</p>}
          {renderCreateError()}

          <button
            type="submit"
            disabled={isPending}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: isPending ? '#9ca3af' : '#2563eb',
              color: '#fff',
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontWeight: 600
            }}
          >
            {isPending ? 'Saving…' : 'Create department'}
          </button>
        </form>
      </section>

      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0 }}>Existing departments</h2>

        {isLoading && <p>Loading departments…</p>}
        {hasListError && <p style={{ color: 'crimson', margin: 0 }}>Unable to load departments.</p>}

        {!isLoading && !hasListError && departments.length === 0 && (
          <p style={{ margin: 0, color: '#6b7280' }}>No departments yet. Create the first one above.</p>
        )}

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
          {departments.map((dept) => (
            <li
              key={dept.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '12px 16px',
                background: '#f9fafb'
              }}
            >
              {dept.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
