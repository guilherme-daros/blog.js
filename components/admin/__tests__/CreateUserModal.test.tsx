import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateUserModal from '../CreateUserModal';
import { createUser } from '@/app/actions/admin';

// Mock the server action
vi.mock('@/app/actions/admin', () => ({
  createUser: vi.fn(),
}));

describe('CreateUserModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a button that opens the modal', () => {
    render(<CreateUserModal />);
    const openBtn = screen.getByRole('button', { name: /\+ new user/i });
    expect(openBtn).toBeInTheDocument();
    
    // Modal should not be visible yet
    expect(screen.queryByRole('heading', { name: /create user/i })).not.toBeInTheDocument();
  });

  it('opens and closes the modal correctly', () => {
    render(<CreateUserModal />);
    const openBtn = screen.getByRole('button', { name: /\+ new user/i });
    fireEvent.click(openBtn);
    
    // Modal is open
    expect(screen.getByRole('heading', { name: /create user/i })).toBeInTheDocument();
    
    // Click cancel
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    
    // Modal is closed
    expect(screen.queryByRole('heading', { name: /create user/i })).not.toBeInTheDocument();
  });

  it('displays error if action throws an error', async () => {
    vi.mocked(createUser).mockRejectedValueOnce(new Error('User already exists'));
    
    render(<CreateUserModal />);
    fireEvent.click(screen.getByRole('button', { name: /\+ new user/i }));
    
    const submitBtn = screen.getByRole('button', { name: /create user/i });
    
    // In our mock for useActionState/useTransition, it runs immediately.
    // However, form action is native in React 19. Since we don't have the real server setup,
    // we fire the submit event on the form itself.
    const form = submitBtn.closest('form') as HTMLFormElement;
    fireEvent.submit(form);
    
    // Error should be displayed
    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
    
    // Modal stays open
    expect(screen.getByRole('heading', { name: /create user/i })).toBeInTheDocument();
  });

  it('closes modal on successful creation', async () => {
    vi.mocked(createUser).mockResolvedValueOnce(undefined);
    
    render(<CreateUserModal />);
    fireEvent.click(screen.getByRole('button', { name: /\+ new user/i }));
    
    const submitBtn = screen.getByRole('button', { name: /create user/i });
    const form = submitBtn.closest('form') as HTMLFormElement;
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /create user/i })).not.toBeInTheDocument();
    });
  });
});
