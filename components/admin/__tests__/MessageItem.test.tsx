import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MessageItem from '../MessageItem';
import { markMessageRead, deleteMessage } from '@/app/actions/admin';

vi.mock('@/app/actions/admin', () => ({
  markMessageRead: vi.fn(),
  deleteMessage: vi.fn(),
}));

describe('MessageItem', () => {
  const mockMsg = {
    id: 1,
    subject: 'Test Subject',
    name: 'John Doe',
    email: 'john@test.com',
    body: 'Hello world',
    created_at: '2026-05-21T10:00:00.000Z',
    read: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
  });

  const renderItem = (msg = mockMsg) => {
    return render(
      <table>
        <tbody>
          <MessageItem msg={msg} />
        </tbody>
      </table>
    );
  };

  it('renders unread message correctly', () => {
    renderItem();
    expect(screen.getByText('Test Subject')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    // Body is hidden initially
    expect(screen.queryByText('Hello world')).not.toBeInTheDocument();
  });

  it('opens accordion and marks as read on click', async () => {
    renderItem();
    
    // Click on the row (subject cell)
    const subject = screen.getByText('Test Subject');
    fireEvent.click(subject);
    
    expect(markMessageRead).toHaveBeenCalledWith(1);
    
    // Accordion content is shown after state update
    await waitFor(() => {
      expect(screen.getByText('Hello world')).toBeInTheDocument();
      expect(screen.getByText('John Doe <john@test.com>')).toBeInTheDocument();
    });
  });

  it('does not call markMessageRead if already read', async () => {
    renderItem({ ...mockMsg, read: true });
    
    const subject = screen.getByText('Test Subject');
    fireEvent.click(subject);
    
    expect(markMessageRead).not.toHaveBeenCalled();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('deletes the message and hides it', async () => {
    renderItem();
    
    const delBtn = screen.getByRole('button', { name: /del/i });
    fireEvent.click(delBtn);
    
    expect(window.confirm).toHaveBeenCalledWith('Delete this message?');
    expect(deleteMessage).toHaveBeenCalledWith(1);
    
    // Message should be removed from DOM
    await waitFor(() => {
      expect(screen.queryByText('Test Subject')).not.toBeInTheDocument();
    });
  });

  it('stops propagation when delete is clicked so accordion does not open', async () => {
    renderItem();
    
    const delBtn = screen.getByRole('button', { name: /del/i });
    fireEvent.click(delBtn);
    
    // Message should be removed from DOM, wait for state update
    await waitFor(() => {
      expect(screen.queryByText('Test Subject')).not.toBeInTheDocument();
    });
    
    // markMessageRead should not be called because event propagation is stopped
    expect(markMessageRead).not.toHaveBeenCalled();
  });
});
