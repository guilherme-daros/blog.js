// ─── Shared page types ────────────────────────────────────────────────────────

/** Type for Next.js App Router searchParams prop */
export type PageSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

// ─── Shared action types ──────────────────────────────────────────────────────

/** Standard return type for all server actions */
export type ActionState = {
  error?: string;
  success?: boolean;
};
