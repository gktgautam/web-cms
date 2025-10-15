import { beforeEach, describe, expect, it, vi } from 'vitest'
import { JobService } from './job.service.js'
import { JobRepo } from './job.repo.js'

vi.mock('./job.repo.js', () => ({
  JobRepo: {
    create: vi.fn()
  }
}))

describe('JobService.create', () => {
  const createMock = vi.mocked(JobRepo.create)

  beforeEach(() => {
    createMock.mockReset()
    createMock.mockResolvedValue({ id: 'job-1' })
  })

  it('normalizes slug by lowercasing and replacing punctuation with hyphens', async () => {
    await JobService.create(
      {
        title: 'Senior QA Engineer!!',
        description: 'desc',
        location: 'Remote',
        employmentType: 'Full-time',
        departmentId: 'dept-1'
      },
      'user-1'
    )

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'senior-qa-engineer'
      })
    )
  })

  it('trims leading and trailing separators when generating slugs', async () => {
    await JobService.create(
      {
        title: '  ---Lead Developer  ',
        description: 'desc',
        location: 'Remote',
        employmentType: 'Full-time',
        departmentId: 'dept-1'
      },
      'user-2'
    )

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'lead-developer'
      })
    )
  })
})
