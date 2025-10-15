import { Router } from 'express';
import { authRouter } from './features/auth/auth.router.js';
import { jobRouter, publicJobRouter } from './features/jobs/job.router.js';
import { appRouter } from './features/applications/app.router.js';
import { deptRouter } from './features/departments/dept.router.js';

export const routes = Router();
routes.use('/auth', authRouter);
routes.use('/jobs', jobRouter);
routes.use('/public/jobs', publicJobRouter);
routes.use('/apps', appRouter);
routes.use('/departments', deptRouter);