import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postService } from '../postService';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    post: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

describe('postService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllPosts returns all posts ordered by published_at', async () => {
    const mockPosts = [{ id: 1 }];
    (prisma.post.findMany as any).mockResolvedValue(mockPosts);

    const result = await postService.getAllPosts();

    expect(result).toEqual(mockPosts);
    expect(prisma.post.findMany).toHaveBeenCalledWith({
      orderBy: { published_at: 'desc' },
    });
  });

  it('getPostById returns a specific post', async () => {
    const mockPost = { id: 1 };
    (prisma.post.findUnique as any).mockResolvedValue(mockPost);

    const result = await postService.getPostById(1);

    expect(result).toEqual(mockPost);
    expect(prisma.post.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('getPostBySlug returns a specific post by slug', async () => {
    const mockPost = { slug: 'test' };
    (prisma.post.findUnique as any).mockResolvedValue(mockPost);

    const result = await postService.getPostBySlug('test');

    expect(result).toEqual(mockPost);
    expect(prisma.post.findUnique).toHaveBeenCalledWith({
      where: { slug: 'test' },
    });
  });

  it('createPost sets all other posts as not featured if new post is featured', async () => {
    const mockData = {
      title: 'Title',
      slug: 'title',
      excerpt: 'Exc',
      content: 'Content',
      tag: 'tag',
      read_time: 5,
      published_at: '2023-01-01',
      is_featured: true,
    };
    (prisma.post.updateMany as any).mockResolvedValue({});
    (prisma.post.create as any).mockResolvedValue({ id: 1 });

    await postService.createPost(mockData);

    expect(prisma.post.updateMany).toHaveBeenCalledWith({
      where: { is_featured: true },
      data: { is_featured: false },
    });
  });

  it('updatePost sets all other posts as not featured if post is featured', async () => {
    (prisma.post.updateMany as any).mockResolvedValue({});
    (prisma.post.update as any).mockResolvedValue({ id: 1 });

    await postService.updatePost(1, { is_featured: true });

    expect(prisma.post.updateMany).toHaveBeenCalledWith({
      where: { is_featured: true },
      data: { is_featured: false },
    });
  });

  it('deletePost deletes a post', async () => {
    (prisma.post.delete as any).mockResolvedValue({ id: 1 });

    await postService.deletePost(1);

    expect(prisma.post.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('featurePost updates a post to be featured and resets others', async () => {
    (prisma.post.updateMany as any).mockResolvedValue({});
    (prisma.post.update as any).mockResolvedValue({ id: 1 });

    await postService.featurePost(1);

    expect(prisma.post.updateMany).toHaveBeenCalledWith({
      where: { is_featured: true },
      data: { is_featured: false },
    });
    expect(prisma.post.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { is_featured: true },
    });
  });
});
