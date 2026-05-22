import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactForm from '../ContactForm';
import { submitContactForm } from '@/app/actions/public';

vi.mock('@/app/actions/public', () => ({
  submitContactForm: vi.fn(),
}));

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ContactForm />);
    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /subject/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('shows success message when action is successful', async () => {
    vi.mocked(submitContactForm).mockResolvedValueOnce({
      success: true,
      error: undefined,
    });

    render(<ContactForm />);
    const form = screen.getByRole('button', { name: /send message/i }).closest('form') as HTMLFormElement;
    
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/your message has been sent successfully/i)).toBeInTheDocument();
    });
    
    // Form should disappear
    expect(screen.queryByRole('button', { name: /send message/i })).not.toBeInTheDocument();
  });

  it('shows error message when action fails', async () => {
    vi.mocked(submitContactForm).mockResolvedValueOnce({
      success: false,
      error: 'Invalid email address',
    });

    render(<ContactForm />);
    const form = screen.getByRole('button', { name: /send message/i }).closest('form') as HTMLFormElement;
    
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
    
    // Form should still be visible
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });
});
