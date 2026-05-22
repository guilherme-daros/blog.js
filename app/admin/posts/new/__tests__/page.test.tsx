import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NewPostPage from '../page';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    post: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/components/admin/PostForm', () => ({
  default: ({ tags }: any) => (
    <div data-testid="post-form">
      Tags: {tags.join(', ')}
    </div>
  ),
}));

describe('NewPostPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders PostForm with distinct tags', async () => {
    (prisma.post.findMany as any).mockResolvedValue([
      { tag: 'react' },
      { tag: 'nextjs' },
    ]);

    const PageContent = await NewPostPage();
    render(PageContent);

    expect(screen.getByText('New Post')).toBeInTheDocument();
    expect(screen.getByTestId('post-form')).toBeInTheDocument();
    expect(screen.getByText('Tags: react, nextjs')).toBeInTheDocument();

    expect(prisma.post.findMany).toHaveBeenCalledWith({
      select: { tag: true },
      distinct: ['tag'],
    });
  });
});
