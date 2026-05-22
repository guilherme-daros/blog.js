import { describe, it, expect, vi, beforeEach } from 'vitest';
import { subscriberService } from '../subscriberService';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    subscriber: {
      findMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('subscriberService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllSubscribers returns subscribers ordered by subscribed_at', async () => {
    const mockSubscribers = [{ id: 1 }];
    (prisma.subscriber.findMany as any).mockResolvedValue(mockSubscribers);

    const result = await subscriberService.getAllSubscribers();

    expect(result).toEqual(mockSubscribers);
    expect(prisma.subscriber.findMany).toHaveBeenCalledWith({
      orderBy: { subscribed_at: 'desc' },
    });
  });

  it('deleteSubscriber deletes a single subscriber', async () => {
    (prisma.subscriber.delete as any).mockResolvedValue({ id: 1 });

    await subscriberService.deleteSubscriber(1);

    expect(prisma.subscriber.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('deleteManySubscribers deletes multiple subscribers', async () => {
    (prisma.subscriber.deleteMany as any).mockResolvedValue({ count: 2 });

    await subscriberService.deleteManySubscribers([1, 2]);

    expect(prisma.subscriber.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: [1, 2] } },
    });
  });

  it('addSubscriber creates a new subscriber', async () => {
    (prisma.subscriber.create as any).mockResolvedValue({ id: 1, email: 'test@example.com' });

    await subscriberService.addSubscriber('test@example.com');

    expect(prisma.subscriber.create).toHaveBeenCalledWith({
      data: { email: 'test@example.com' },
    });
  });
});
