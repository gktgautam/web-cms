import { Router } from 'express';
import { auth } from '../../core/security/authMiddleware.js';
import { JobController } from './job.controller.js';
export const jobRouter = Router();
export const publicJobRouter = Router();

jobRouter.get('/', auth(), JobController.list);
jobRouter.post('/', auth(['RECRUITER','ADMIN','HIRING_MANAGER']), JobController.create);
jobRouter.get('/:id', auth(), JobController.byId);
jobRouter.patch('/:id', auth(['RECRUITER','ADMIN','HIRING_MANAGER']), JobController.update);
jobRouter.post('/:id/review', auth(['RECRUITER','ADMIN','HIRING_MANAGER']), JobController.requestReview);
jobRouter.post('/:id/publish', auth(['RECRUITER','ADMIN']), JobController.publish);
jobRouter.post('/:id/unpublish', auth(['RECRUITER','ADMIN']), JobController.unpublish);
jobRouter.post('/:id/archive', auth(['RECRUITER','ADMIN']), JobController.archive);
jobRouter.post('/:id/restore', auth(['RECRUITER','ADMIN']), JobController.restore);

publicJobRouter.get('/', JobController.publicList);
publicJobRouter.get('/:slug', JobController.publicBySlug);