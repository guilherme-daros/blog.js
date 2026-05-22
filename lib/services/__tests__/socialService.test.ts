import { describe, it, expect, vi, beforeEach } from 'vitest';
import { socialService } from '../socialService';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    socialLink: {
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe('socialService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllSocialLinks returns links ordered by sort_order', async () => {
    const mockLinks = [{ id: 1, sort_order: 0 }];
    (prisma.socialLink.findMany as any).mockResolvedValue(mockLinks);

    const result = await socialService.getAllSocialLinks();

    expect(result).toEqual(mockLinks);
    expect(prisma.socialLink.findMany).toHaveBeenCalledWith({
      orderBy: { sort_order: 'asc' },
    });
  });

  it('updateSocialLinks executes a transaction with correct operations', async () => {
    const mockTx = {
      socialLink: {
        findMany: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
        deleteMany: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      },
    };

    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      return callback(mockTx);
    });

    const incomingLinks = [
      { id: 2, platform: 'Twitter', url: 'test.com', sort_order: 0 },
      { platform: 'GitHub', url: 'gh.com', handle: '@test', sort_order: 1 },
    ];

    await socialService.updateSocialLinks(incomingLinks);

    // Should delete id 1 since it's not in incomingLinks
    expect(mockTx.socialLink.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: [1] } },
    });

    // Should update id 2
    expect(mockTx.socialLink.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: {
        platform: 'Twitter',
        url: 'test.com',
        handle: undefined,
        sort_order: 0,
      },
    });

    // Should create new link (id is undefined)
    expect(mockTx.socialLink.create).toHaveBeenCalledWith({
      data: {
        platform: 'GitHub',
        url: 'gh.com',
        handle: '@test',
        sort_order: 1,
      },
    });
  });
});
