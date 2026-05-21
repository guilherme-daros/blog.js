import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUser, deleteUser, deleteSubscribers, createPost, updatePost, featurePost, updateSocialLinks } from '../admin';
import { userService } from '@/lib/services/userService';
import { subscriberService } from '@/lib/services/subscriberService';
import { postService } from '@/lib/services/postService';
import { socialService } from '@/lib/services/socialService';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Mock dependencies
vi.mock('@/lib/services/userService', () => ({
  userService: {
    createUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

vi.mock('@/lib/services/subscriberService', () => ({
  subscriberService: {
    deleteManySubscribers: vi.fn(),
  },
}));

vi.mock('@/lib/services/postService', () => ({
  postService: {
    createPost: vi.fn(),
    updatePost: vi.fn(),
    featurePost: vi.fn(),
  },
}));

vi.mock('@/lib/services/socialService', () => ({
  socialService: {
    updateSocialLinks: vi.fn(),
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Admin Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    it('creates a user when admin and valid data', async () => {
      // Mock admin session
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { role: 'admin', name: 'admin', email: 'admin@test.com' },
        expires: '',
      });

      const formData = new FormData();
      formData.append('username', 'newuser');
      formData.append('password', 'secret123');
      formData.append('role', 'viewer');

      await createUser(formData);

      expect(userService.createUser).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'secret123',
        role: 'viewer',
      });
      expect(revalidatePath).toHaveBeenCalledWith('/admin/users');
    });

    it('throws error when unauthorized', async () => {
      // Mock non-admin session
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { role: 'viewer', name: 'viewer', email: 'viewer@test.com' },
        expires: '',
      });

      const formData = new FormData();
      formData.append('username', 'newuser');
      formData.append('password', 'secret123');
      formData.append('role', 'viewer');

      await expect(createUser(formData)).rejects.toThrow('Unauthorized');
      expect(userService.createUser).not.toHaveBeenCalled();
    });

    it('throws validation error with invalid data', async () => {
      // Mock admin session
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { role: 'admin', name: 'admin', email: 'admin@test.com' },
        expires: '',
      });

      const formData = new FormData();
      formData.append('username', 'ab'); // Too short

      await expect(createUser(formData)).rejects.toThrow();
      expect(userService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('deletes user when admin', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { role: 'admin', name: 'admin', email: 'admin@test.com' },
        expires: '',
      });

      await deleteUser(5);

      expect(userService.deleteUser).toHaveBeenCalledWith(5);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/users');
    });

    it('throws error when not admin', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { role: 'viewer', name: 'viewer', email: 'viewer@test.com' },
        expires: '',
      });

      await expect(deleteUser(5)).rejects.toThrow('Unauthorized');
      expect(userService.deleteUser).not.toHaveBeenCalled();
    });
  });

  describe('deleteSubscribers', () => {
    it('bulk deletes subscribers when admin', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { role: 'admin', name: 'admin', email: 'admin@test.com' },
        expires: '',
      });

      await deleteSubscribers([1, 2, 3]);

      expect(subscriberService.deleteManySubscribers).toHaveBeenCalledWith([1, 2, 3]);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/subscribers');
    });
  });

  describe('Post Actions', () => {
    const validPostData = {
      title: 'Test Post',
      slug: 'test-post',
      excerpt: 'Excerpt',
      content: 'Content',
      tag: 'testing',
      read_time: '5',
      published_at: '2026-05-21T00:00:00Z',
      is_featured: '1',
    };

    it('createPost creates a post and redirects when admin', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { role: 'admin', name: 'admin' }, expires: ''
      });
      const formData = new FormData();
      Object.entries(validPostData).forEach(([k, v]) => formData.append(k, v));

      await createPost(null, formData);

      expect(postService.createPost).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Post',
        is_featured: true,
        read_time: 5,
      }));
      expect(redirect).toHaveBeenCalledWith('/admin/posts');
    });

    it('updatePost updates a post and redirects when admin', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { role: 'admin', name: 'admin' }, expires: ''
      });
      const formData = new FormData();
      Object.entries(validPostData).forEach(([k, v]) => formData.append(k, v));

      await updatePost(1, null, formData);

      expect(postService.updatePost).toHaveBeenCalledWith(1, expect.objectContaining({
        title: 'Test Post',
      }));
      expect(redirect).toHaveBeenCalledWith('/admin/posts');
    });

    it('featurePost toggles feature flag', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { role: 'admin', name: 'admin' }, expires: ''
      });

      await featurePost(10);
      expect(postService.featurePost).toHaveBeenCalledWith(10);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/posts');
    });
  });

  describe('updateSocialLinks', () => {
    it('updates social links when admin', async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { role: 'admin', name: 'admin' }, expires: ''
      });

      const links = [{ id: 1, platform: 'Twitter', url: 'https://twitter.com/test', sort_order: 1 }];
      const res = await updateSocialLinks(null, links);

      expect(socialService.updateSocialLinks).toHaveBeenCalledWith(links);
      expect(res).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/admin/social');
    });
  });
});
