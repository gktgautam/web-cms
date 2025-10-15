import { api } from '../../lib/api';

export type JobStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface Department {
  id: string;
  name: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  employmentType: string;
  status: JobStatus;
  departmentId: string;
  department: Department;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface JobListResponse {
  items: Job[];
  total: number;
  page: number;
}

export interface JobFormValues {
  title: string;
  description: string;
  location: string;
  employmentType: string;
  departmentId: string;
}

export interface JobListParams {
  status?: JobStatus;
  q?: string;
  dept?: string;
  page?: number;
  limit?: number;
}

export const listJobs = async (params: JobListParams = {}) => {
  const response = await api.get<JobListResponse>('/jobs', {
    params: {
      ...params,
      status: params.status || undefined,
      q: params.q || undefined,
      dept: params.dept || undefined,
      page: params.page || undefined,
      limit: params.limit || undefined
    }
  });
  return response.data;
};

export const getJob = async (id: string) => {
  const response = await api.get<Job>(`/jobs/${id}`);
  return response.data;
};

export const createJob = async (payload: JobFormValues) => {
  const response = await api.post<Job>('/jobs', payload);
  return response.data;
};

export const updateJob = async (id: string, payload: JobFormValues) => {
  const response = await api.patch<Job>(`/jobs/${id}`, payload);
  return response.data;
};

export const requestJobReview = async (id: string) => {
  const response = await api.post<Job>(`/jobs/${id}/review`);
  return response.data;
};

export const publishJob = async (id: string) => {
  const response = await api.post<Job>(`/jobs/${id}/publish`);
  return response.data;
};

export const unpublishJob = async (id: string) => {
  const response = await api.post<Job>(`/jobs/${id}/unpublish`);
  return response.data;
};

export const archiveJob = async (id: string) => {
  const response = await api.post<Job>(`/jobs/${id}/archive`);
  return response.data;
};

export const restoreJob = async (id: string) => {
  const response = await api.post<Job>(`/jobs/${id}/restore`);
  return response.data;
};

export const getDepartments = async () => {
  const response = await api.get<Department[]>('/departments');
  return response.data;
};

export const DEFAULT_JOB_FORM: JobFormValues = {
  title: '',
  description: '',
  location: '',
  employmentType: '',
  departmentId: ''
};
