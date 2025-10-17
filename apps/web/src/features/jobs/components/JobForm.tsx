import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_JOB_FORM, JobFormValues, getDepartments } from '../api';
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import SafeEditor from './SafeEditor.js';

interface JobFormProps {
  initialValues?: JobFormValues;
  onSubmit: (values: JobFormValues) => void;
  submitting?: boolean;
  error?: string | null;
  submitLabel?: string;
}

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Freelance'];

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

   const editorRef = useRef(null);
    const log = () => {
      if (editorRef.current) {
        console.log(editorRef.current.getContent());
      }
    };
 
  return (
    <div className='p-10'>
    <form onSubmit={handleSubmit} className='p-10 bg-gray-100 rounded-2xl space-y-5'>
      <h1 className='text-2xl font-bold'>{submitLabel}</h1>
      {error && <p className='text-crimson-600'>{error}</p>}

      <div>
         <label className='field-label'>Title</label>
         <input required value={values.title} onChange={handleChange('title')} disabled={submitting} placeholder="Role title" className='input' />
      </div>
      <div>
        <label className='field-label'>Department</label>
        <select
          required
          value={values.departmentId}
          onChange={handleChange('departmentId')}
          disabled={submitting || loadingDepartments || departments.length === 0}
          className='input'
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
          <p className='text-gray-600 text-sm'>Create a department first to assign this job.</p>
        )}
      </div>

      <div>
        <label className='field-label'>Location</label>
        <input required value={values.location} onChange={handleChange('location')} disabled={submitting} placeholder="e.g. Remote, Berlin" className='input' />
      </div>

      <div>
        <label className='field-label'>Employment type</label>
        <select
          required
          value={values.employmentType}
          onChange={handleChange('employmentType')}
          disabled={submitting}
          className='input'
        >
          <option value="" disabled>Select employment type</option>
          {employmentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='field-label'>Description</label>  
        <SafeEditor
  value={values.description}
  onChange={(content) =>
    handleChange('description')({ target: { value: content } })
  }
  disabled={submitting}
/>
        {/* <Editor
          tinymceScriptSrc='/tinymce/js/tinymce/tinymce.min.js'
          licenseKey='gpl'
          value={values.description}
          onEditorChange={(content) => handleChange('description')({ target: { value: content } })}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'advlist', 'anchor', 'autolink', 'charmap', 'code', 'fullscreen',
              'help', 'image', 'insertdatetime', 'link', 'lists', 'media',
              'preview', 'searchreplace', 'table', 'visualblocks', 'inlinecss', 
            ],
            toolbar: 'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
            placeholder: 'Describe the opportunity…', 
          }}
          disabled={submitting}
        /> */}
      </div>
       
 
   
      <button type="submit" disabled={submitting || loadingDepartments || departments.length === 0}
        className={`btn btn-primary-animated mt-3 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`} >
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
    </div>
  );
}
