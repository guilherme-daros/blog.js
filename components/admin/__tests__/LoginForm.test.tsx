import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from '../LoginForm';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('LoginForm', () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
  });

  it('renders login form elements', () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('displays error message on failed sign in', async () => {
    (signIn as any).mockResolvedValue({ error: 'CredentialsSignin' });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByPlaceholderText('username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpass' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });

    expect(signIn).toHaveBeenCalledWith('credentials', {
      redirect: false,
      username: 'admin',
      password: 'wrongpass',
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects to /admin on successful sign in', async () => {
    (signIn as any).mockResolvedValue({ ok: true, error: null });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByPlaceholderText('username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'correctpass' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});
