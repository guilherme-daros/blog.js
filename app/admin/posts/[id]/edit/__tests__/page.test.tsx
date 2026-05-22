import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditPostPage from '../page';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

vi.mock('@/lib/prisma', () => ({
  default: {
    post: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('@/components/admin/PostForm', () => ({
  default: ({ post, tags }: any) => (
    <div data-testid="post-form">
      Post: {post?.title}
      Tags: {tags.join(', ')}
    </div>
  ),
}));

describe('EditPostPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders PostForm with existing post and tags', async () => {
    (prisma.post.findUnique as any).mockResolvedValue({ id: 1, title: 'My Post' });
    (prisma.post.findMany as any).mockResolvedValue([
      { tag: 'react' },
      { tag: 'nextjs' },
    ]);

    const PageContent = await EditPostPage({
      params: Promise.resolve({ id: '1' }),
    });
    render(PageContent);

    expect(screen.getByText('Edit Post')).toBeInTheDocument();
    expect(screen.getByTestId('post-form')).toBeInTheDocument();
    expect(screen.getByText(/Post: My Post/)).toBeInTheDocument();
    expect(screen.getByText(/Tags: react, nextjs/)).toBeInTheDocument();

    expect(prisma.post.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('calls notFound if post does not exist', async () => {
    (prisma.post.findUnique as any).mockResolvedValue(null);

    await EditPostPage({
      params: Promise.resolve({ id: '999' }),
    });

    expect(notFound).toHaveBeenCalled();
  });
});
