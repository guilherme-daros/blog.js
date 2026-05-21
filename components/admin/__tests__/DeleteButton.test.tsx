import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DeleteButton from '../DeleteButton';

describe('DeleteButton', () => {
  const mockAction = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
  });

  it('renders correctly with default props', () => {
    render(<DeleteButton id={1} action={mockAction} />);
    const button = screen.getByRole('button', { name: /del/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('calls action when confirmed', async () => {
    render(<DeleteButton id={1} action={mockAction} confirmMessage="Delete?" />);
    const button = screen.getByRole('button', { name: /del/i });
    
    fireEvent.click(button);
    
    expect(window.confirm).toHaveBeenCalledWith('Delete?');
    // Since useTransition is mocked to execute synchronously in vitest.setup.ts, 
    // the action should be called immediately.
    expect(mockAction).toHaveBeenCalledWith(1);
  });

  it('does not call action when cancelled', () => {
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(false));
    render(<DeleteButton id={1} action={mockAction} />);
    const button = screen.getByRole('button', { name: /del/i });
    
    fireEvent.click(button);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockAction).not.toHaveBeenCalled();
  });

  it('respects disabled prop', () => {
    render(<DeleteButton id={1} action={mockAction} disabled={true} />);
    const button = screen.getByRole('button', { name: /del/i });
    
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(window.confirm).not.toHaveBeenCalled();
    expect(mockAction).not.toHaveBeenCalled();
  });
});
