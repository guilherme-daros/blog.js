import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SocialLinksForm from '../SocialLinksForm';
import { updateSocialLinks } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

vi.mock('@/app/actions/admin', () => ({
  updateSocialLinks: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

const mockLinks = [
  { id: 1, platform: 'Twitter', url: 'https://twitter.com', handle: '@test', sort_order: 0 },
];

describe('SocialLinksForm', () => {
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      refresh: mockRefresh,
    });
  });

  it('renders initial links correctly', () => {
    render(<SocialLinksForm initialLinks={mockLinks} />);
    expect(screen.getByDisplayValue('Twitter')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://twitter.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('@test')).toBeInTheDocument();
  });

  it('allows adding a new link row', () => {
    render(<SocialLinksForm initialLinks={mockLinks} />);
    
    // initially 1 row
    expect(screen.getAllByRole('row').length).toBe(2); // 1 header + 1 body
    
    fireEvent.click(screen.getByRole('button', { name: 'Add link' }));
    
    // now 2 rows
    expect(screen.getAllByRole('row').length).toBe(3);
  });

  it('allows removing a link row', () => {
    render(<SocialLinksForm initialLinks={mockLinks} />);
    
    fireEvent.click(screen.getByText('DEL'));
    
    expect(screen.getAllByRole('row').length).toBe(1); // just header
  });

  it('allows editing link fields', () => {
    render(<SocialLinksForm initialLinks={mockLinks} />);
    
    const platformInput = screen.getByDisplayValue('Twitter');
    fireEvent.change(platformInput, { target: { value: 'X' } });
    
    expect(screen.getByDisplayValue('X')).toBeInTheDocument();
  });
});
