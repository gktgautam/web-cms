import { api } from '../../lib/api';

export interface Department {
  id: string;
  name: string;
}

export interface CreateDepartmentPayload {
  name: string;
}

export const listDepartments = async () => {
  const response = await api.get<Department[]>('/departments');
  return response.data;
};

export const createDepartment = async (payload: CreateDepartmentPayload) => {
  const response = await api.post<Department>('/departments', payload);
  return response.data;
};
