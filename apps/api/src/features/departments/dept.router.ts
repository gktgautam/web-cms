import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../core/prisma.js';
import { auth } from '../../core/security/authMiddleware.js';
import { createDeptDto } from './dept.schemas.js';

export const deptRouter = Router();

deptRouter.get('/', auth(['ADMIN','RECRUITER','HIRING_MANAGER','VIEWER']), async (_req, res) => {
  const items = await prisma.department.findMany({ orderBy: { name: 'asc' } });
  res.json(items);
});

deptRouter.post('/', auth(['ADMIN']), async (req, res) => {
  const parsed = createDeptDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const d = await prisma.department.create({ data: parsed.data });
  res.status(201).json(d);
});