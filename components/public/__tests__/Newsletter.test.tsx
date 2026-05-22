import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Newsletter from '../Newsletter';
import { subscribeNewsletter } from '@/app/actions/public';

vi.mock('@/app/actions/public', () => ({
  subscribeNewsletter: vi.fn(),
}));

describe('Newsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Newsletter />);
    expect(screen.getByRole('heading', { name: /stay in the terminal/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('shows success message when action is successful', async () => {
    vi.mocked(subscribeNewsletter).mockResolvedValueOnce({
      success: true,
      error: undefined,
    });

    render(<Newsletter />);
    const form = screen.getByRole('button', { name: /subscribe/i }).closest('form') as HTMLFormElement;
    
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/subscribed successfully/i)).toBeInTheDocument();
    });
    
    // Form should disappear
    expect(screen.queryByRole('button', { name: /subscribe/i })).not.toBeInTheDocument();
  });

  it('shows error message when action fails', async () => {
    vi.mocked(subscribeNewsletter).mockResolvedValueOnce({
      success: false,
      error: 'Already subscribed',
    });

    render(<Newsletter />);
    const form = screen.getByRole('button', { name: /subscribe/i }).closest('form') as HTMLFormElement;
    
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Already subscribed')).toBeInTheDocument();
    });
    
    // Form should still be visible
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });
});
