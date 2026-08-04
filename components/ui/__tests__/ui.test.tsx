import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../button';
import { Input } from '../input';
import { Card, CardHeader, CardBody, CardFooter } from '../Card';

describe('UI Components', () => {
  describe('Button', () => {
    it('renders a button element by default', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('renders an anchor tag if href is provided', () => {
      render(<Button href="/test">Link</Button>);
      const link = screen.getByRole('link', { name: /link/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    it('applies variant classes correctly', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button', { name: /ghost/i });
      // Verify that it contains Tailwind utility classes for the ghost variant
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('text-muted-foreground');
    });
  });

  describe('Input', () => {
    it('renders an input element', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
    });

    it('renders a label if provided', () => {
      render(<Input label="Username" id="username" />);
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    it('renders an error message if provided', () => {
      render(<Input error="Invalid input" />);
      expect(screen.getByText(/invalid input/i)).toBeInTheDocument();
    });
  });

  describe('Card', () => {
    it('renders Card and subcomponents correctly', () => {
      render(
        <Card>
          <CardHeader>Header</CardHeader>
          <CardBody>Body</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      );
      
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });
});
