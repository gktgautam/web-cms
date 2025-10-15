import { z } from 'zod';
export const registerDto = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.enum(['ADMIN','RECRUITER','HIRING_MANAGER','VIEWER']).optional(),
  departmentId: z.string().uuid().optional(),
});
export const loginDto = z.object({ email: z.string().email(), password: z.string().min(6) });