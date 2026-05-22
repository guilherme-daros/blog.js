import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminUsers from '../page';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock the dependencies
vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/components/admin/CreateUserModal', () => ({
  default: () => <div data-testid="create-user-modal">CreateUserModal</div>,
}));

vi.mock('@/components/admin/DeleteButton', () => ({
  default: ({ disabled, id }: any) => (
    <button data-testid={`delete-btn-${id}`} disabled={disabled}>
      Delete {id}
    </button>
  ),
}));

const mockUsers = [
  { id: 1, username: 'admin', role: 'admin', created_at: new Date('2023-01-01T00:00:00Z') },
  { id: 2, username: 'johndoe', role: 'user', created_at: new Date('2023-01-02T00:00:00Z') },
];

describe('AdminUsers Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders users and CreateUserModal when currentUser is admin', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { name: 'admin', role: 'admin' },
    });
    (prisma.user.findMany as any).mockResolvedValue(mockUsers);

    // Call the server component directly
    const PageContent = await AdminUsers();
    render(PageContent);

    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.getAllByText('admin').length).toBeGreaterThan(0);
    
    // Admin should see the create user modal
    expect(screen.getByTestId('create-user-modal')).toBeInTheDocument();

    // Delete button for 'admin' (current user) should be disabled
    const deleteAdminBtn = screen.getByTestId('delete-btn-1');
    expect(deleteAdminBtn).toBeDisabled();

    // Delete button for 'johndoe' should be enabled
    const deleteUserBtn = screen.getByTestId('delete-btn-2');
    expect(deleteUserBtn).not.toBeDisabled();
  });

  it('renders users but hides admin actions when currentUser is not admin', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { name: 'johndoe', role: 'user' },
    });
    (prisma.user.findMany as any).mockResolvedValue(mockUsers);

    const PageContent = await AdminUsers();
    render(PageContent);

    // Should not see create user modal
    expect(screen.queryByTestId('create-user-modal')).not.toBeInTheDocument();

    // All delete buttons should be disabled for non-admins
    expect(screen.getByTestId('delete-btn-1')).toBeDisabled();
    expect(screen.getByTestId('delete-btn-2')).toBeDisabled();
  });

  it('renders empty state when no users are found', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { name: 'admin', role: 'admin' },
    });
    (prisma.user.findMany as any).mockResolvedValue([]);

    const PageContent = await AdminUsers();
    render(PageContent);

    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });
});
