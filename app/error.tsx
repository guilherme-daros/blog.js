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
    <div className="max-w-[80rem] mx-auto px-6 pt-[160px] pb-20 text-center" style={{ paddingTop: "120px" }}>
      <div className="bg-background border border-border rounded-[var(--radius)] px-8 py-6 font-mono text-[13px] leading-[22px] text-left min-w-[320px] mb-8" style={{ margin: "0 auto 2rem" }}>
        <div className="text-muted-foreground">$ systemctl status terminal-blog</div>
        <div className="text-primary">● terminal-blog.service - Terminal Blog</div>
        <div className="text-muted-foreground">   Loaded: loaded</div>
        <div className="line-error" style={{ color: "var(--error)" }}>
          Active: failed (Result: server-error)
        </div>
        <div className="text-muted-foreground" style={{ fontSize: "11px", marginTop: "10px" }}>
          Error: {error.message || "An unexpected error occurred."}
          {error.digest && <><br />Digest: {error.digest}</>}
        </div>
        <div>
          <br />
          <span className="text-muted-foreground">$</span>{" "}
          <span className="cursor-blink"></span>
        </div>
      </div>
      <div className="flex gap-4 justify-center" style={{ justifyContent: "center", display: "flex", gap: "1rem" }}>
        <button className="font-mono text-[12px] font-normal leading-[18px] tracking-[1.92px] uppercase no-underline inline-flex items-center justify-center px-7 py-3 rounded-[var(--radius)] cursor-pointer transition-all duration-200 bg-primary text-white border border-primary hover:bg-[#e05e00] hover:border-[#e05e00]" onClick={() => reset()}>
          Retry system
        </button>
        <Link href="/" className="font-mono text-[12px] font-normal leading-[18px] tracking-[1.92px] uppercase no-underline inline-flex items-center justify-center px-7 py-3 rounded-[var(--radius)] cursor-pointer transition-all duration-200 bg-transparent text-foreground border border-border hover:border-primary hover:text-primary hover:bg-panel">
          Return home
        </Link>
      </div>
    </div>
  );
}
