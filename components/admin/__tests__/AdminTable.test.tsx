import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminTable from '../AdminTable';

describe('AdminTable', () => {
  it('renders empty message when isEmpty is true', () => {
    render(
      <AdminTable headers={[]} isEmpty={true} emptyMessage="No users found.">
        <tr><td>User</td></tr>
      </AdminTable>
    );

    expect(screen.getByText('No users found.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders default empty message when isEmpty is true but no emptyMessage provided', () => {
    render(
      <AdminTable headers={[]} isEmpty={true}>
        <tr><td>User</td></tr>
      </AdminTable>
    );

    expect(screen.getByText('No items found.')).toBeInTheDocument();
  });

  it('renders table with headers and children when isEmpty is false', () => {
    render(
      <AdminTable
        headers={[<th>Name</th>, <th>Email</th>]}
        isEmpty={false}
      >
        <tr>
          <td>John Doe</td>
          <td>john@example.com</td>
        </tr>
      </AdminTable>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    
    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    
    // Check children
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
