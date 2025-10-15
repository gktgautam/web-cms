import { Router } from 'express';
import { auth } from '../../core/security/authMiddleware.js';
import { JobController } from './job.controller.js';
export const jobRouter = Router();
export const publicJobRouter = Router();

jobRouter.get('/', auth(), JobController.list);
jobRouter.post('/', auth(['RECRUITER','ADMIN','HIRING_MANAGER']), JobController.create);
jobRouter.post('/:id/publish', auth(['RECRUITER','ADMIN']), JobController.publish);

publicJobRouter.get('/', JobController.publicList);
publicJobRouter.get('/:slug', JobController.publicBySlug);