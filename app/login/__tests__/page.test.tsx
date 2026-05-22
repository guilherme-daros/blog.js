import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../page';
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

vi.mock('@/components/admin/LoginForm', () => ({
  default: () => <div data-testid="login-form">Login Form Mock</div>,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /admin if already authenticated', async () => {
    (getServerSession as any).mockResolvedValue({ user: { name: 'test' } });

    await expect(LoginPage()).rejects.toThrowError('Redirected to /admin');
    expect(redirect).toHaveBeenCalledWith('/admin');
  });

  it('renders LoginForm if not authenticated', async () => {
    (getServerSession as any).mockResolvedValue(null);

    const PageContent = await LoginPage();
    render(PageContent);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });
});
