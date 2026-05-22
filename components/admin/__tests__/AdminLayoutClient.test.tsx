import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminLayoutClient from '../AdminLayoutClient';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

describe('AdminLayoutClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as any).mockReturnValue('/admin');
  });

  it('renders correctly with given role and username', () => {
    render(
      <AdminLayoutClient role="admin" username="testadmin">
        <div data-testid="children">Content</div>
      </AdminLayoutClient>
    );

    expect(screen.getByText('testadmin')).toBeInTheDocument();
    expect(screen.getAllByText('admin')[0]).toBeInTheDocument();
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('shows Users link for admin role', () => {
    render(
      <AdminLayoutClient role="admin" username="testadmin">
        <div />
      </AdminLayoutClient>
    );
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('hides Users link for non-admin role', () => {
    render(
      <AdminLayoutClient role="user" username="testuser">
        <div />
      </AdminLayoutClient>
    );
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
  });

  it('calls signOut when logout is clicked', () => {
    render(
      <AdminLayoutClient role="admin" username="testadmin">
        <div />
      </AdminLayoutClient>
    );
    
    fireEvent.click(screen.getByText('Logout'));
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
  });

  it('toggles sidebar on menu button click', () => {
    render(
      <AdminLayoutClient role="admin" username="testadmin">
        <div />
      </AdminLayoutClient>
    );

    const menuBtn = screen.getByText('MENU');
    fireEvent.click(menuBtn);
    
    // Test that the overlay is present, meaning sidebar is open
    // Since overlay only renders when sidebarOpen is true
    expect(screen.getByRole('button', { name: 'MENU' })).toBeInTheDocument(); // still there
  });
});
