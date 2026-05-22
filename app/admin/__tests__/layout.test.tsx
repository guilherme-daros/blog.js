import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminLayout from '../layout';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation((url) => {
    throw new Error(`Redirected to ${url}`);
  }),
}));

vi.mock('@/components/admin/AdminLayoutClient', () => ({
  default: ({ role, username, children }: any) => (
    <div data-testid="admin-layout-client">
      <span>Role: {role}</span>
      <span>User: {username}</span>
      {children}
    </div>
  ),
}));

describe('AdminLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login if not authenticated', async () => {
    (getServerSession as any).mockResolvedValue(null);

    await expect(AdminLayout({ children: <div>Test</div> })).rejects.toThrowError('Redirected to /login');
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('renders AdminLayoutClient with session info', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { name: 'admin_user', role: 'admin' },
    });

    const LayoutContent = await AdminLayout({ children: <div>Test Child</div> });
    render(LayoutContent as any);

    expect(screen.getByTestId('admin-layout-client')).toBeInTheDocument();
    expect(screen.getByText('Role: admin')).toBeInTheDocument();
    expect(screen.getByText('User: admin_user')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('provides default role and username if missing in session', async () => {
    (getServerSession as any).mockResolvedValue({
      user: {},
    });

    const LayoutContent = await AdminLayout({ children: <div>Test Child</div> });
    render(LayoutContent as any);

    expect(screen.getByText('Role: viewer')).toBeInTheDocument();
    expect(screen.getByText('User: user')).toBeInTheDocument();
  });
});
