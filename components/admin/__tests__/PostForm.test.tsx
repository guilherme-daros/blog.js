import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PostForm from '../PostForm';
import * as actions from '@/app/actions/admin';
import { Post } from '@prisma/client';

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/app/actions/admin', () => ({
  createPost: vi.fn(),
  updatePost: vi.fn(),
}));

const mockPost: Post = {
  id: 1,
  title: 'My First Post',
  slug: 'my-first-post',
  content: '<p>Hello world</p>',
  excerpt: 'A short intro',
  published_at: new Date('2023-01-01T00:00:00Z'),
  read_time: 5,
  tag: 'react',
};

describe('PostForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset useActionState mock behavior if needed
    // In React 19, useActionState can be mocked or we can just let it run if it's supported by the testing environment.
    // However, since useActionState is relatively new, testing it directly via RTL might require some setup
    // For now, we will test the rendering and interactions that don't depend entirely on the action execution
  });

  it('renders form for creating new post', () => {
    render(<PostForm tags={['react', 'nextjs']} />);
    
    expect(screen.getByLabelText('Title')).toHaveValue('');
    expect(screen.getByLabelText('Slug')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Create post' })).toBeInTheDocument();
  });

  it('renders form with existing post data', () => {
    render(<PostForm post={mockPost} tags={['react', 'nextjs']} />);
    
    expect(screen.getByLabelText('Title')).toHaveValue('My First Post');
    expect(screen.getByLabelText('Slug')).toHaveValue('my-first-post');
    expect(screen.getByLabelText('Excerpt')).toHaveValue('A short intro');
    expect(screen.getByLabelText('Content (HTML)')).toHaveValue('<p>Hello world</p>');
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('auto-generates slug from title when slug is untouched', () => {
    render(<PostForm tags={[]} />);
    
    const titleInput = screen.getByLabelText('Title');
    const slugInput = screen.getByLabelText('Slug');

    fireEvent.change(titleInput, { target: { value: 'New Awesome Post!' } });
    
    expect(slugInput).toHaveValue('new-awesome-post');
  });

  it('does not auto-generate slug from title after slug is manually edited', () => {
    render(<PostForm tags={[]} />);
    
    const titleInput = screen.getByLabelText('Title');
    const slugInput = screen.getByLabelText('Slug');

    fireEvent.focus(slugInput); // Marks slug as edited
    fireEvent.change(slugInput, { target: { value: 'custom-slug' } });
    
    fireEvent.change(titleInput, { target: { value: 'New Awesome Post!' } });
    
    expect(slugInput).toHaveValue('custom-slug');
  });

  it('does not auto-generate slug for existing post', () => {
    render(<PostForm post={mockPost} tags={[]} />);
    
    const titleInput = screen.getByLabelText('Title');
    const slugInput = screen.getByLabelText('Slug');

    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    
    expect(slugInput).toHaveValue('my-first-post');
  });
});
