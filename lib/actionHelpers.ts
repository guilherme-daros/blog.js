import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ActionState } from "@/types";

/**
 * Wraps an admin server action with authentication + admin role check.
 * Throws "Unauthorized" if the session is missing or user is not admin.
 */
export async function withAdminAction<T>(
  fn: () => Promise<T>
): Promise<T> {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "admin") throw new Error("Unauthorized");
  return fn();
}

/**
 * Wraps any authenticated server action (viewer or admin).
 * Throws "Unauthorized" if there is no active session.
 */
export async function withAuthAction<T>(
  fn: () => Promise<T>
): Promise<T> {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  return fn();
}

/**
 * Wraps an admin action that returns ActionState,
 * catching errors and returning them as { error } automatically.
 */
export async function withAdminActionState(
  fn: () => Promise<ActionState>
): Promise<ActionState> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "admin") {
      return { error: "Unauthorized" };
    }
    return await fn();
  } catch (error: any) {
    if (error?.digest?.includes("NEXT_REDIRECT")) throw error;
    return { error: error.message || "An unexpected error occurred" };
  }
}
