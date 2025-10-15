import { Request, Response } from 'express';
import { createJobDto } from './job.schemas.js';
import { JobService } from './job.service.js';

export const JobController = {
  list: async (req: Request, res: Response) => {
    const { q, status, dept, page = '1', limit = '20' } = req.query as any;
    res.json(await JobService.list(q, status, dept, Number(page), Number(limit)));
  },
  create: async (req: Request, res: Response) => {
    const parsed = createJobDto.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    const job = await JobService.create(parsed.data, (req as any).user.id);
    res.status(201).json(job);
  },
  publish: async (req: Request, res: Response) => {
    const job = await JobService.publish(req.params.id);
    res.json(job);
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