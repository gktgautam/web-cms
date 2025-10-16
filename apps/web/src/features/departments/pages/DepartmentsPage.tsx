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
        return <p className='text-red-500'>{message}</p>;
      }
    }

    return <p className='text-red-500'>Unable to create department. Please try again.</p>;
  };

  return (
    <div className='p-10'>
      
       <h1  className='text-2xl font-bold'>Departments</h1>
        <p className='text-gray-600'>Create new departments to keep your job postings organised. Departments are also available when inviting new users.</p>

      <section className='mt-10 border border-gray-300 rounded-lg p-5 grid gap-4  bg-gray-100'>
        <form onSubmit={handleSubmit} className='grid gap-4 mt-5'>

          <div className='flex items-end gap-5'>
            <div className='w-full'>
              <label className='field-label'>Department name</label>
              <input type="text" value={name} onChange={(event) => { setName(event.target.value); if (formError) { setFormError(null); } }} disabled={isPending} placeholder="e.g. Marketing" className='input' />
            </div>

            <button type="submit" disabled={isPending} className='btn btn-primary-animated min-w-[220px]'>
             {isPending ? 'Saving…' : 'Create department'}
            </button> 
          </div> 

          {formError && <p className='text-red-500'>{formError}</p>}
          {renderCreateError()}

           
        </form>
      </section>

     <section className='mt-10 gap-4'>
        <h2 className='text-lg mb-2'>Existing departments</h2>

        {isLoading && <p>Loading departments…</p>}
        {hasListError && <p className='text-red-500'>Unable to load departments.</p>}

        {!isLoading && !hasListError && departments.length === 0 && (
          <p className='text-gray-500'>No departments yet. Create the first one above.</p>
        )}

        <ul className='list-none m-0 p-0 grid gap-2'>
          {departments.map((dept) => (
            <li key={dept.id} className='border border-gray-300 rounded-lg p-3 bg-gray-50'>
              {dept.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
