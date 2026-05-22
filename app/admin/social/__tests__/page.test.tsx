import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminSocialLinks from '../page';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

vi.mock('@/lib/prisma', () => ({
  default: {
    socialLink: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/components/admin/SocialLinksForm', () => ({
  default: ({ initialLinks }: any) => (
    <div data-testid="social-links-form">
      Form with {initialLinks.length} links
    </div>
  ),
}));

const mockLinks = [
  { id: 1, platform: 'GitHub', url: 'https://github.com', handle: '@test', sort_order: 0 },
];

describe('AdminSocialLinks Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders SocialLinksForm for admin user', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { name: 'admin', role: 'admin' },
    });
    (prisma.socialLink.findMany as any).mockResolvedValue(mockLinks);

    const PageContent = await AdminSocialLinks();
    render(PageContent);

    expect(screen.getByTestId('social-links-form')).toBeInTheDocument();
    expect(screen.getByText('Form with 1 links')).toBeInTheDocument();
  });

  it('renders static table for non-admin user', async () => {
    (getServerSession as any).mockResolvedValue({
      user: { name: 'user', role: 'user' },
    });
    (prisma.socialLink.findMany as any).mockResolvedValue(mockLinks);

    const PageContent = await AdminSocialLinks();
    render(PageContent);

    expect(screen.queryByTestId('social-links-form')).not.toBeInTheDocument();
    expect(screen.getByText('Social Links')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('https://github.com')).toBeInTheDocument();
  });
});
