import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JobService } from './job.service.js';
import { JobRepo } from './job.repo.js';

vi.mock('./job.repo.js', () => ({
  JobRepo: {
    create: vi.fn(),
    slugExists: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn()
  }
}));

describe('JobService.create', () => {
  const createMock = vi.mocked(JobRepo.create);
  const slugExistsMock = vi.mocked(JobRepo.slugExists);

  beforeEach(() => {
    createMock.mockReset();
    slugExistsMock.mockReset();
    slugExistsMock.mockResolvedValue(false);
    createMock.mockResolvedValue({ id: 'job-1' });
  });

  const basePayload = {
    description: 'desc',
    location: 'Remote',
    employmentType: 'Full-time',
    departmentId: 'dept-1'
  };

  it('normalizes slug by lowercasing and replacing punctuation with hyphens', async () => {
    await JobService.create({ ...basePayload, title: 'Senior QA Engineer!!' }, 'user-1');

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'senior-qa-engineer'
      })
    );
  });

  it('trims leading and trailing separators when generating slugs', async () => {
    await JobService.create({ ...basePayload, title: '  ---Lead Developer  ' }, 'user-2');

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'lead-developer'
      })
    );
  });

  it('appends an incrementing suffix when the slug already exists', async () => {
    slugExistsMock.mockResolvedValueOnce(true).mockResolvedValue(false);

    await JobService.create({ ...basePayload, title: 'Senior QA Engineer!!' }, 'user-1');

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'senior-qa-engineer-2'
      })
    );
  });
});

describe('JobService.update', () => {
  const findByIdMock = vi.mocked(JobRepo.findById);
  const updateMock = vi.mocked(JobRepo.update);
  const slugExistsMock = vi.mocked(JobRepo.slugExists);

  beforeEach(() => {
    findByIdMock.mockReset();
    updateMock.mockReset();
    slugExistsMock.mockReset();
    findByIdMock.mockResolvedValue({ id: 'job-1', title: 'Original', slug: 'original', status: 'DRAFT' });
    updateMock.mockResolvedValue({ id: 'job-1' });
    slugExistsMock.mockResolvedValue(false);
  });

  it('returns null when the job does not exist', async () => {
    findByIdMock.mockResolvedValueOnce(null);

    const result = await JobService.update('job-1', { title: 'Updated' });

    expect(result).toBeNull();
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('regenerates slug when the title changes', async () => {
    await JobService.update('job-1', { title: 'New Title' });

    expect(updateMock).toHaveBeenCalledWith(
      'job-1',
      expect.objectContaining({ slug: 'new-title' })
    );
  });

  it('does not touch the slug when the title is unchanged', async () => {
    await JobService.update('job-1', { description: 'Updated copy' });

    expect(updateMock).toHaveBeenCalledWith('job-1', { description: 'Updated copy' });
  });
});

describe('JobService.publish', () => {
  const findByIdMock = vi.mocked(JobRepo.findById);
  const updateStatusMock = vi.mocked(JobRepo.updateStatus);

  beforeEach(() => {
    findByIdMock.mockReset();
    updateStatusMock.mockReset();
    findByIdMock.mockResolvedValue({ id: 'job-1', status: 'REVIEW' });
    updateStatusMock.mockResolvedValue({ id: 'job-1', status: 'PUBLISHED' });
  });

  it('sets the job status to published with a timestamp', async () => {
    await JobService.publish('job-1');

    expect(updateStatusMock).toHaveBeenCalledWith(
      'job-1',
      'PUBLISHED',
      expect.objectContaining({ publishedAt: expect.any(Date) })
    );
  });

  it('throws when the job is not publishable', async () => {
    findByIdMock.mockResolvedValueOnce({ id: 'job-1', status: 'ARCHIVED' });

    await expect(JobService.publish('job-1')).rejects.toThrow('Only draft or review jobs can be published');
  });
});
