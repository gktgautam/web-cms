import { z } from 'zod';

export const createJobDto = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  location: z.string().min(2),
  employmentType: z.string().min(2),
  departmentId: z.string().uuid()
});

export const updateJobDto = createJobDto.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided to update'
});