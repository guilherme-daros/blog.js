import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminSubscribers from '../page';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

vi.mock('@/lib/prisma', () => ({
  default: {
    subscriber: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/components/admin/SubscribersClient', () => ({
  default: ({ subscribers, isAdmin }: any) => (
    <div data-testid="subscribers-client">
      <span>Admin: {isAdmin ? 'Yes' : 'No'}</span>
      <span>Count: {subscribers.length}</span>
    </div>
  ),
}));

const mockSubscribers = [
  { id: 1, email: 'sub1@example.com', subscribed_at: new Date('2023-01-01T00:00:00Z') },
];

describe('AdminSubscribers Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes subscribers and isAdmin=true to SubscribersClient for admin user', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { name: 'admin', role: 'admin' },
    });
    (prisma.subscriber.findMany as any).mockResolvedValue(mockSubscribers);

    const PageContent = await AdminSubscribers();
    render(PageContent);

    expect(screen.getByTestId('subscribers-client')).toBeInTheDocument();
    expect(screen.getByText('Admin: Yes')).toBeInTheDocument();
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('passes subscribers and isAdmin=false to SubscribersClient for non-admin user', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { name: 'user', role: 'user' },
    });
    (prisma.subscriber.findMany as any).mockResolvedValue(mockSubscribers);

    const PageContent = await AdminSubscribers();
    render(PageContent);

    expect(screen.getByTestId('subscribers-client')).toBeInTheDocument();
    expect(screen.getByText('Admin: No')).toBeInTheDocument();
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
