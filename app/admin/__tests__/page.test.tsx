import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDashboard from '../page';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    post: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    message: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    subscriber: {
      count: vi.fn(),
    },
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard statistics and recent data', async () => {
    (prisma.post.count as any).mockResolvedValue(10);
    (prisma.message.count as any).mockImplementation((args: any) => {
      if (args?.where?.read === false) return 2; // unread count
      return 15; // total count
    });
    (prisma.subscriber.count as any).mockResolvedValue(100);

    (prisma.post.findMany as any).mockResolvedValue([
      { id: 1, title: 'Recent Post', slug: 'recent-post', tag: 'news', published_at: new Date('2023-01-01') },
    ]);

    (prisma.message.findMany as any).mockResolvedValue([
      { id: 1, name: 'Alice', subject: 'Hello', read: false, created_at: new Date('2023-01-02') },
      { id: 2, name: 'Bob', subject: '', read: true, created_at: new Date('2023-01-03') },
    ]);

    const PageContent = await AdminDashboard();
    render(PageContent);

    // Check stats
    expect(screen.getByText('10')).toBeInTheDocument(); // Posts
    expect(screen.getByText('15')).toBeInTheDocument(); // Messages
    expect(screen.getByText('100')).toBeInTheDocument(); // Subscribers
    expect(screen.getByText('2 unread')).toBeInTheDocument();

    // Check posts
    expect(screen.getByText('Recent Post')).toHaveAttribute('href', '/post/recent-post');
    expect(screen.getByText('news')).toBeInTheDocument();

    // Check messages
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('(no subject)')).toBeInTheDocument();
  });
});
