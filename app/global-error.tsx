"use client";

import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} data-scroll-behavior="smooth">
      <body className="login-body">
        <div className="error-page">
          <div className="terminal-box error-terminal" style={{ textAlign: "left" }}>
            <div className="line-dim">$ kernel-panic --level critical</div>
            <div className="line-orange">FATAL EXCEPTION DETECTED</div>
            <div className="line-dim">The core system layout has crashed.</div>
            <div className="line-error" style={{ color: "var(--error)", fontSize: "11px", marginTop: "10px" }}>
              {error.message || "Root level execution failure."}
            </div>
            <div>
              <br />
              <span className="line-dim">$</span>{" "}
              <span className="cursor-blink"></span>
            </div>
          </div>
          <div className="error-actions" style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={() => reset()}>
              Reboot system
            </button>
            <a href="/" className="btn btn-outline">
              Exit to BIOS
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
