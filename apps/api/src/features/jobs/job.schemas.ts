import { z } from 'zod';
export const createJobDto = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  location: z.string().min(2),
  employmentType: z.string().min(2),
  departmentId: z.string().uuid(),
});