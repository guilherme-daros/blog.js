import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SubscribersClient from '../SubscribersClient';
import { deleteSubscriber, deleteSubscribers } from '@/app/actions/admin';

vi.mock('@/app/actions/admin', () => ({
  deleteSubscriber: vi.fn(),
  deleteSubscribers: vi.fn(),
}));

vi.mock('@/components/admin/DeleteButton', () => ({
  default: ({ id, action, confirmMessage }: any) => (
    <button data-testid={`delete-btn-${id}`} onClick={() => action(id)}>
      Delete
    </button>
  ),
}));

const mockSubscribers = [
  { id: 1, email: 'user1@example.com', subscribed_at: new Date('2023-01-01T00:00:00Z') },
  { id: 2, email: 'user2@example.com', subscribed_at: new Date('2023-01-02T00:00:00Z') },
];

describe('SubscribersClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when there are no subscribers', () => {
    render(<SubscribersClient subscribers={[]} isAdmin={true} />);
    expect(screen.getByText('No subscribers yet.')).toBeInTheDocument();
  });

  it('renders list of subscribers when available', () => {
    render(<SubscribersClient subscribers={mockSubscribers} isAdmin={true} />);
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('delete-btn-1')).toBeInTheDocument();
  });

  it('does not render Manage or Delete buttons if not isAdmin', () => {
    render(<SubscribersClient subscribers={mockSubscribers} isAdmin={false} />);
    
    // Manage button should be disabled if not admin
    expect(screen.getByRole('button', { name: 'Manage' })).toBeDisabled();
    
    // Delete buttons should not be visible
    expect(screen.queryByTestId('delete-btn-1')).not.toBeInTheDocument();
  });

  it('allows managing multiple subscribers', async () => {
    window.confirm = vi.fn().mockReturnValue(true);

    render(<SubscribersClient subscribers={mockSubscribers} isAdmin={true} />);
    
    // Click Manage
    fireEvent.click(screen.getByRole('button', { name: 'Manage' }));
    
    // Actions column should disappear, checkboxes appear
    expect(screen.queryByTestId('delete-btn-1')).not.toBeInTheDocument();
    
    const checkboxes = screen.getAllByRole('checkbox');
    // 1 header + 2 row checkboxes = 3
    expect(checkboxes.length).toBe(3);

    // Click select all checkbox (the first one)
    fireEvent.click(checkboxes[0]);
    
    // Delete Selected should be enabled
    const deleteBtn = screen.getByRole('button', { name: 'Delete Selected (2)' });
    expect(deleteBtn).toBeEnabled();

    // Click Delete Selected
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalledWith('Delete 2 selected subscriber(s)?');
    
    await waitFor(() => {
      expect(deleteSubscribers).toHaveBeenCalledWith([1, 2]);
    });
  });
});
