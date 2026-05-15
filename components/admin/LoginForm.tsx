"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("Invalid username or password");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="login-card">
      <div className="login-logo">
        Terminal<span>.</span>admin
      </div>
      <div className="login-terminal">
        <div className="line-dim">$ ssh admin@terminal.blog</div>
        <div className="line-orange">Authentication required</div>
        <div>
          <span className="line-dim">$</span>{" "}
          <span className="cursor-blink"></span>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="username"
            required
            autoFocus
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>
        <label className="remember-label">
          <input type="checkbox" name="remember" value="1" disabled={loading} />{" "}
          Remember me for 30 days
        </label>
        <button
          type="submit"
          className="btn btn-primary login-btn"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <Link href="/" className="login-back">
        ← Back to site
      </Link>
    </div>
  );
}
