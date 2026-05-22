import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Hero from '../Hero';
import BackToTop from '../BackToTop';

describe('Public Components', () => {
  describe('Hero', () => {
    it('renders hero content', () => {
      render(<Hero />);
      expect(screen.getByRole('heading', { name: /insights for the modern investor/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /read latest/i })).toHaveAttribute('href', '#posts');
      expect(screen.getByRole('link', { name: /subscribe/i })).toHaveAttribute('href', '#newsletter');
    });
  });

  describe('BackToTop', () => {
    it('is not visible initially', () => {
      const { container } = render(<BackToTop />);
      expect(container.firstChild).toBeNull();
    });

    it('becomes visible after scrolling down', () => {
      render(<BackToTop />);
      
      // Simulate scroll
      fireEvent.scroll(window, { target: { scrollY: 500 } });
      
      const button = screen.getByRole('button', { name: /↑/i });
      expect(button).toBeInTheDocument();
    });

    it('scrolls to top on click', () => {
      window.scrollTo = vi.fn();
      render(<BackToTop />);
      
      // Simulate scroll to make it visible
      fireEvent.scroll(window, { target: { scrollY: 500 } });
      
      const button = screen.getByRole('button', { name: /↑/i });
      fireEvent.click(button);
      
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
  });
});
