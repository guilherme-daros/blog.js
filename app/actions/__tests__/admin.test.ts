import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUser, deleteUser, deleteSubscribers } from '../admin';
import { userService } from '@/lib/services/userService';
import { subscriberService } from '@/lib/services/subscriberService';
import { getServerSession } from 'next-auth';
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
});
