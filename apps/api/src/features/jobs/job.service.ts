import { JobRepo } from './job.repo.js';

export const JobService = {
  list: async (q?: string, status?: string, dept?: string, page = 1, limit = 20) => {
    const where: any = {};
    if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }];
    if (status) where.status = status;
    if (dept) where.departmentId = dept;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([JobRepo.findMany(where, skip, limit), JobRepo.count(where)]);
    return { items, total, page };
  },
  create: (dto: any, userId: string) => {
    const slug = dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return JobRepo.create({ ...dto, slug, createdById: userId, status: 'DRAFT' });
  },
  publish: (id: string) => JobRepo.publish(id),
  publicList: () => JobRepo.findPublic(),
  publicBySlug: (slug: string) => JobRepo.findBySlug(slug)
};