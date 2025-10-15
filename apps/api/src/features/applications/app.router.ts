import { Router } from 'express';
import { prisma } from '../../core/prisma.js';
import { upload } from '../../middleware/upload.js';
import { auth } from '../../core/security/authMiddleware.js';
import { z } from 'zod';

export const appRouter = Router();
const applySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  coverLetter: z.string().optional(),
});

// Internal list by Job
appRouter.get('/jobs/:id', auth(['ADMIN','RECRUITER','HIRING_MANAGER']), async (req, res) => {
  const items = await prisma.application.findMany({ where: { jobId: req.params.id }, orderBy: { createdAt: 'desc' } });
  res.json(items);
});

// Public apply by job slug
appRouter.post('/apply/:slug', upload.single('resume'), async (req, res) => {
  const parsed = applySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const job = await prisma.job.findFirst({ where: { slug: req.params.slug, status: 'PUBLISHED' } });
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const app = await prisma.application.create({
    data: {
      jobId: job.id,
      name: parsed.data.name,
      email: parsed.data.email,
      coverLetter: parsed.data.coverLetter,
      resumeUrl: req.file ? `/uploads/${req.file.filename}` : null
    }
  });
  res.status(201).json(app);
});