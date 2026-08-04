"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/actions/public";
import { Alert } from "@/components/ui/alert";

export default function Newsletter() {
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, {
    success: false,
    error: undefined,
  });

  return (
    <section className="max-w-[80rem] mx-auto px-6 pb-20" id="newsletter">
      <div className="bg-surface border border-border rounded-[var(--radius)] p-16 flex items-center justify-between gap-12 max-[820px]:flex-col max-[820px]:text-center max-[820px]:p-12 max-[820px]:gap-8">
        <div>
          <h2 className="text-2xl font-normal text-neutral-950 dark:text-white mb-2">Stay in the terminal</h2>
          <p className="text-muted-foreground text-sm">
            Weekly market intelligence, delivered to your inbox. No fluff, just
            data and analysis.
          </p>
        </div>
        {state?.success ? (
          <Alert variant="success" className="max-w-[320px]">
            ✓ Subscribed successfully.
          </Alert>
        ) : (
          <div className="flex flex-col gap-2 w-full max-w-[320px]">
            <form className="flex gap-0 shrink-0 max-[820px]:flex-col max-[820px]:w-full gap-y-2" action={formAction}>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                disabled={isPending}
                className="font-mono text-sm tracking-[-0.017em] text-foreground bg-background border border-[rgb(77,73,71)] border-r-0 max-[820px]:border-r max-[820px]:rounded-[var(--radius)] rounded-l-[var(--radius)] px-6 h-[54px] flex-1 max-[820px]:flex-none min-w-0 max-[820px]:w-full max-w-[320px] outline-none transition-colors duration-200 focus:border-primary placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={isPending}
                className="font-mono text-xs tracking-[1.92px] uppercase bg-primary text-white border border-primary max-[820px]:rounded-[var(--radius)] rounded-r-[var(--radius)] px-8 h-[54px] cursor-pointer transition-colors duration-200 hover:bg-[#e05e00]"
              >
                {isPending ? "..." : "Subscribe"}
              </button>
            </form>
            {state?.error && (
              <Alert variant="destructive" className="py-2 text-xs">
                {state.error}
              </Alert>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
