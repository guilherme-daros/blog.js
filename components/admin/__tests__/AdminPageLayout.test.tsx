import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminPageLayout from '../AdminPageLayout';

describe('AdminPageLayout', () => {
  it('renders title, children, and pluralized item name for count > 1', () => {
    render(
      <AdminPageLayout title="Users" count={5} itemName="User">
        <div data-testid="child-content">Content</div>
      </AdminPageLayout>
    );

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('5 Users')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders singular item name for count = 1', () => {
    render(
      <AdminPageLayout title="Users" count={1} itemName="User">
        <div>Content</div>
      </AdminPageLayout>
    );

    expect(screen.getByText('1 User')).toBeInTheDocument();
  });

  it('renders pluralized item name for count = 0', () => {
    render(
      <AdminPageLayout title="Users" count={0} itemName="User">
        <div>Content</div>
      </AdminPageLayout>
    );

    expect(screen.getByText('0 Users')).toBeInTheDocument();
  });

  it('renders action if provided', () => {
    render(
      <AdminPageLayout
        title="Users"
        count={5}
        itemName="User"
        action={<button>Add User</button>}
      >
        <div>Content</div>
      </AdminPageLayout>
    );

    expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument();
  });
});
