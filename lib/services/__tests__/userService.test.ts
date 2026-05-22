import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from '../userService';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
  },
}));

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllUsers returns all users', async () => {
    const mockUsers = [{ id: 1, username: 'admin' }];
    (prisma.user.findMany as any).mockResolvedValue(mockUsers);

    const result = await userService.getAllUsers();

    expect(result).toEqual(mockUsers);
    expect(prisma.user.findMany).toHaveBeenCalled();
  });

  it('createUser hashes password if provided and creates user', async () => {
    (bcrypt.hash as any).mockResolvedValue('hashed_password');
    (prisma.user.create as any).mockResolvedValue({ id: 1, username: 'testuser' });

    await userService.createUser({
      username: 'testuser',
      password: 'password123',
      role: 'admin',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: 'testuser',
        password_hash: 'hashed_password',
        role: 'admin',
      },
    });
  });

  it('createUser uses empty string for password_hash if no password provided', async () => {
    (prisma.user.create as any).mockResolvedValue({ id: 2, username: 'testuser2' });

    await userService.createUser({
      username: 'testuser2',
      role: 'user',
    });

    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: 'testuser2',
        password_hash: '',
        role: 'user',
      },
    });
  });

  it('deleteUser deletes a user by id', async () => {
    (prisma.user.delete as any).mockResolvedValue({ id: 1 });

    await userService.deleteUser(1);

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
