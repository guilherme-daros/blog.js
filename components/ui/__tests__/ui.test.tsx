import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../Button';
import { Input } from '../Input';
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
      // Since CSS modules hash classes, we just check if it has multiple classes
      // and doesn't crash
      expect(button.className).toContain('btn');
      expect(button.className).toContain('ghost');
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
