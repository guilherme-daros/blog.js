import { describe, it, expect, vi, beforeEach } from 'vitest';
import { messageService } from '../messageService';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    message: {
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('messageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllMessages returns messages ordered by created_at desc', async () => {
    const mockMessages = [{ id: 1 }, { id: 2 }];
    (prisma.message.findMany as any).mockResolvedValue(mockMessages);

    const result = await messageService.getAllMessages();

    expect(result).toEqual(mockMessages);
    expect(prisma.message.findMany).toHaveBeenCalledWith({
      orderBy: { created_at: 'desc' },
    });
  });

  it('markAsRead updates the read status of a message', async () => {
    const mockMessage = { id: 1, read: true };
    (prisma.message.update as any).mockResolvedValue(mockMessage);

    const result = await messageService.markAsRead(1);

    expect(result).toEqual(mockMessage);
    expect(prisma.message.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { read: true },
    });
  });

  it('deleteMessage deletes a message', async () => {
    const mockMessage = { id: 1 };
    (prisma.message.delete as any).mockResolvedValue(mockMessage);

    const result = await messageService.deleteMessage(1);

    expect(result).toEqual(mockMessage);
    expect(prisma.message.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('createMessage creates a new message with read=false', async () => {
    const mockData = { name: 'John', email: 'john@example.com', subject: 'Hello', message: 'World' };
    const mockMessage = { id: 1, ...mockData, read: false };
    (prisma.message.create as any).mockResolvedValue(mockMessage);

    const result = await messageService.createMessage(mockData);

    expect(result).toEqual(mockMessage);
    expect(prisma.message.create).toHaveBeenCalledWith({
      data: {
        body: 'World',
        name: 'John',
        email: 'john@example.com',
        subject: 'Hello',
        read: false,
      },
    });
  });
});
