import '@testing-library/jest-dom/vitest';
import { vi, beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Mock Next-Auth
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

// Mock Prisma
const prismaMock = mockDeep<PrismaClient>();
vi.mock('@/lib/prisma', () => ({
  default: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});

// Mock React useTransition and useActionState for React 19 testing without real server environments
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useTransition: () => [false, (cb: any) => cb()],
    useActionState: (action: any, initialState: any) => {
      const [state, setState] = actual.useState(initialState);
      const [isPending, setIsPending] = actual.useState(false);
      const dispatch = async (payload: any) => {
        setIsPending(true);
        try {
          let formData = payload;
          if (payload && typeof payload.preventDefault === 'function') {
            payload.preventDefault();
            formData = new FormData(payload.target);
          } else if (payload instanceof HTMLFormElement) {
            formData = new FormData(payload);
          }
          const result = await action(state, formData);
          setState(result);
        } finally {
          setIsPending(false);
        }
      };
      return [state, dispatch, isPending];
    }
  };
});
