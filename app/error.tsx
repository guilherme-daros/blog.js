"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="error-page" style={{ paddingTop: "120px" }}>
      <div className="terminal-box error-terminal" style={{ margin: "0 auto 2rem" }}>
        <div className="line-dim">$ systemctl status terminal-blog</div>
        <div className="line-orange">● terminal-blog.service - Terminal Blog</div>
        <div className="line-dim">   Loaded: loaded</div>
        <div className="line-error" style={{ color: "var(--error)" }}>
          Active: failed (Result: server-error)
        </div>
        <div className="line-dim" style={{ fontSize: "11px", marginTop: "10px" }}>
          Error: {error.message || "An unexpected error occurred."}
          {error.digest && <><br />Digest: {error.digest}</>}
        </div>
        <div>
          <br />
          <span className="line-dim">$</span>{" "}
          <span className="cursor-blink"></span>
        </div>
      </div>
      <div className="error-actions" style={{ justifyContent: "center", display: "flex", gap: "1rem" }}>
        <button className="btn btn-primary" onClick={() => reset()}>
          Retry system
        </button>
        <Link href="/" className="btn btn-outline">
          Return home
        </Link>
      </div>
    </div>
  );
}
