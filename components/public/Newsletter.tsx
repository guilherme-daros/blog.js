"use client";

import { useState } from "react";

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate server action or API call
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="newsletter-card">
        <div>
          <h2>Stay in the terminal</h2>
          <p>
            Weekly market intelligence, delivered to your inbox. No fluff, just
            data and analysis.
          </p>
        </div>
        {status === "success" ? (
          <div className="newsletter-success">✓ Subscribed successfully.</div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              disabled={status === "loading"}
            />
            <button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
