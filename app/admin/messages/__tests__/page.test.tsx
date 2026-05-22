import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminMessages from '../page';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    message: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

vi.mock('@/components/admin/MessageItem', () => ({
  default: ({ msg }: any) => (
    <tr data-testid={`message-item-${msg.id}`}>
      <td>{msg.subject}</td>
    </tr>
  ),
}));

describe('AdminMessages Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders messages and handles unread_first=1', async () => {
    (prisma.message.findMany as any).mockResolvedValue([
      { id: 1, subject: 'Hello', read: false },
      { id: 2, subject: 'Test', read: true },
    ]);

    const PageContent = await AdminMessages({
      searchParams: Promise.resolve({ unread_first: '1' }),
    });
    render(PageContent);

    expect(prisma.message.findMany).toHaveBeenCalledWith({
      orderBy: [{ read: 'asc' }, { id: 'desc' }],
    });

    expect(screen.getByTestId('message-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('message-item-2')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();

    const allLink = screen.getByText('All');
    expect(allLink).toHaveAttribute('href', '/admin/messages');
  });

  it('renders messages and handles default ordering', async () => {
    (prisma.message.findMany as any).mockResolvedValue([]);

    const PageContent = await AdminMessages({
      searchParams: Promise.resolve({}),
    });
    render(PageContent);

    expect(prisma.message.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'desc' },
    });

    expect(screen.getByText('No messages yet.')).toBeInTheDocument();

    const newLink = screen.getByText('New');
    expect(newLink).toHaveAttribute('href', '/admin/messages?unread_first=1');
  });
});
