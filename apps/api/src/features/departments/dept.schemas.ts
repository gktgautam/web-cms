import { z } from 'zod';
export const createDeptDto = z.object({ name: z.string().min(2) });