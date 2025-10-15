import { prisma } from '../../core/prisma.js';
export const JobRepo = {
  findMany: (where: any, skip = 0, take = 20) =>
    prisma.job.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { department: true } }),
  count: (where: any) => prisma.job.count({ where }),
  create: (data: any) => prisma.job.create({ data }),
  publish: (id: string) =>
    prisma.job.update({ where: { id }, data: { status: 'PUBLISHED', publishedAt: new Date() } }),
  findPublic: () => prisma.job.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, title: true, slug: true, location: true, employmentType: true, department: { select: { name: true } }, publishedAt: true },
    orderBy: { publishedAt: 'desc' }
  }),
  findBySlug: (slug: string) => prisma.job.findFirst({ where: { slug, status: 'PUBLISHED' } })
};