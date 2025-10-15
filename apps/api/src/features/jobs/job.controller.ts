import { Request, Response } from 'express';
import { createJobDto, updateJobDto } from './job.schemas.js';
import { JobService } from './job.service.js';

export const JobController = {
  list: async (req: Request, res: Response) => {
    const { q, status, dept, page = '1', limit = '20' } = req.query as any;
    res.json(await JobService.list(q, status, dept, Number(page), Number(limit)));
  },
  byId: async (req: Request, res: Response) => {
    const job = await JobService.byId(req.params.id);
    if (!job) return res.status(404).json({ error: 'Not found' });
    res.json(job);
  },
  create: async (req: Request, res: Response) => {
    const parsed = createJobDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    const job = await JobService.create(parsed.data, (req as any).user.id);
    res.status(201).json(job);
  },
  update: async (req: Request, res: Response) => {
    const parsed = updateJobDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    try {
      const job = await JobService.update(req.params.id, parsed.data);
      if (!job) return res.status(404).json({ error: 'Not found' });
      res.json(job);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Unable to update job' });
    }
  },
  requestReview: async (req: Request, res: Response) => {
    try {
      const job = await JobService.requestReview(req.params.id);
      if (!job) return res.status(404).json({ error: 'Not found' });
      res.json(job);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Unable to submit for review' });
    }
  },
  publish: async (req: Request, res: Response) => {
    try {
      const job = await JobService.publish(req.params.id);
      if (!job) return res.status(404).json({ error: 'Not found' });
      res.json(job);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Unable to publish job' });
    }
  },
  unpublish: async (req: Request, res: Response) => {
    try {
      const job = await JobService.unpublish(req.params.id);
      if (!job) return res.status(404).json({ error: 'Not found' });
      res.json(job);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Unable to unpublish job' });
    }
  },
  archive: async (req: Request, res: Response) => {
    try {
      const job = await JobService.archive(req.params.id);
      if (!job) return res.status(404).json({ error: 'Not found' });
      res.json(job);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Unable to archive job' });
    }
  },
  restore: async (req: Request, res: Response) => {
    try {
      const job = await JobService.restore(req.params.id);
      if (!job) return res.status(404).json({ error: 'Not found' });
      res.json(job);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Unable to restore job' });
    }
  },
  publicList: async (_req: Request, res: Response) => {
    res.json(await JobService.publicList());
  },
  publicBySlug: async (req: Request, res: Response) => {
    const job = await JobService.publicBySlug(req.params.slug);
    if (!job) return res.status(404).json({ error: 'Not found' });
    res.json(job);
  }
};