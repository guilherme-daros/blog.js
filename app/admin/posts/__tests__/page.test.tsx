import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminPosts from '../page';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    post: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

const mockPosts = [
  {
    id: 1,
    title: 'First Post',
    tag: 'react',
    published_at: new Date('2023-01-01T00:00:00Z'),
    reads: 100,
    is_featured: true,
  },
  {
    id: 2,
    title: 'Second Post',
    tag: 'nextjs',
    published_at: new Date('2023-01-02T00:00:00Z'),
    reads: 50,
    is_featured: false,
  },
];

describe('AdminPosts Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders posts and New Post button', async () => {
    (prisma.post.findMany as any).mockResolvedValue(mockPosts);

    const PageContent = await AdminPosts();
    render(PageContent);

    expect(screen.getByText('+ New Post')).toHaveAttribute('href', '/admin/posts/new');

    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('nextjs')).toBeInTheDocument();

    // Check featured status
    expect(screen.getByText('Yes')).toBeInTheDocument(); // For First Post
    expect(screen.getByRole('button', { name: 'Feature' })).toBeInTheDocument(); // For Second Post

    // Check edit and delete actions
    expect(screen.getAllByText('Edit').length).toBe(2);
    expect(screen.getAllByText('Del').length).toBe(2);
  });

  it('renders empty state when no posts', async () => {
    (prisma.post.findMany as any).mockResolvedValue([]);

    const PageContent = await AdminPosts();
    render(PageContent);

    expect(screen.getByText('No posts found.')).toBeInTheDocument();
  });
});
