"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/actions/public";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, {
    success: false,
    error: undefined,
  });

  return (
    <section className={styles.section} id="newsletter">
      <div className={styles.card}>
        <div>
          <h2>Stay in the terminal</h2>
          <p>
            Weekly market intelligence, delivered to your inbox. No fluff, just
            data and analysis.
          </p>
        </div>
        {state?.success ? (
          <div className={styles.success}>✓ Subscribed successfully.</div>
        ) : (
          <div className={styles.formWrapper}>
            <form className={styles.form} action={formAction}>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                disabled={isPending}
              />
              <button type="submit" disabled={isPending}>
                {isPending ? "..." : "Subscribe"}
              </button>
            </form>
            {state?.error && (
              <div className={styles.error}>
                {state.error}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
