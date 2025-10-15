import { prisma } from '../../core/prisma.js';

export const JobRepo = {
  findMany: (where: any, skip = 0, take = 20) =>
    prisma.job.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { department: true } }),
  count: (where: any) => prisma.job.count({ where }),
  findById: (id: string) =>
    prisma.job.findUnique({ where: { id }, include: { department: true } }),
  create: (data: any) => prisma.job.create({ data, include: { department: true } }),
  update: (id: string, data: any) => prisma.job.update({ where: { id }, data, include: { department: true } }),
  updateStatus: (id: string, status: string, extra: any = {}) =>
    prisma.job.update({ where: { id }, data: { status, ...extra }, include: { department: true } }),
  slugExists: (slug: string, excludeId?: string) =>
    prisma.job
      .count({ where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) } })
      .then((count) => count > 0),
  findPublic: () =>
    prisma.job.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, slug: true, location: true, employmentType: true, department: { select: { name: true } }, publishedAt: true },
      orderBy: { publishedAt: 'desc' }
    }),
  findBySlug: (slug: string) => prisma.job.findFirst({ where: { slug, status: 'PUBLISHED' } })
};