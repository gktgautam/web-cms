import { JobRepo } from './job.repo.js';

const normalizeSlug = (title: string) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .trim();
  return base || 'job';
};

const generateSlug = async (title: string, excludeId?: string) => {
  const base = normalizeSlug(title);
  let candidate = base;
  let suffix = 2;
  while (await JobRepo.slugExists(candidate, excludeId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
};

const ensureJob = async (id: string) => {
  const job = await JobRepo.findById(id);
  return job;
};

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
  byId: (id: string) => JobRepo.findById(id),
  create: async (dto: any, userId: string) => {
    const slug = await generateSlug(dto.title);
    return JobRepo.create({ ...dto, slug, createdById: userId, status: 'DRAFT' });
  },
  update: async (id: string, dto: any) => {
    const job = await ensureJob(id);
    if (!job) return null;
    const data: any = { ...dto };
    if (dto.title && dto.title !== job.title) {
      data.slug = await generateSlug(dto.title, id);
    }
    return JobRepo.update(id, data);
  },
  requestReview: async (id: string) => {
    const job = await ensureJob(id);
    if (!job) return null;
    if (job.status !== 'DRAFT') throw new Error('Only draft jobs can be submitted for review');
    return JobRepo.updateStatus(id, 'REVIEW');
  },
  publish: async (id: string) => {
    const job = await ensureJob(id);
    if (!job) return null;
    if (!['DRAFT', 'REVIEW'].includes(job.status)) throw new Error('Only draft or review jobs can be published');
    return JobRepo.updateStatus(id, 'PUBLISHED', { publishedAt: new Date() });
  },
  unpublish: async (id: string) => {
    const job = await ensureJob(id);
    if (!job) return null;
    if (job.status !== 'PUBLISHED') throw new Error('Only published jobs can be unpublished');
    return JobRepo.updateStatus(id, 'DRAFT', { publishedAt: null });
  },
  archive: async (id: string) => {
    const job = await ensureJob(id);
    if (!job) return null;
    return JobRepo.updateStatus(id, 'ARCHIVED', { publishedAt: null });
  },
  restore: async (id: string) => {
    const job = await ensureJob(id);
    if (!job) return null;
    if (job.status !== 'ARCHIVED') throw new Error('Only archived jobs can be restored');
    return JobRepo.updateStatus(id, 'DRAFT', { publishedAt: null });
  },
  publicList: () => JobRepo.findPublic(),
  publicBySlug: (slug: string) => JobRepo.findBySlug(slug)
};
