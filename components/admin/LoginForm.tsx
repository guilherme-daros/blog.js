"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
    <div className="w-full max-w-[400px] flex flex-col gap-6">
      <div className="font-mono text-sm font-medium text-white tracking-[1.92px] uppercase text-center">
        Terminal<span className="text-primary">.</span>admin
      </div>
      <div className="bg-surface border border-border rounded-[var(--radius)] p-4 px-5 font-mono text-[12px] leading-[20px]">
        <div className="text-muted-foreground">$ ssh admin@terminal.blog</div>
        <div className="text-primary">Authentication required</div>
        <div>
          <span className="text-muted-foreground">$</span>{" "}
          <span className="cursor-blink"></span>
        </div>
      </div>

      {error && (
        <div className="font-mono text-[12px] text-destructive bg-destructive/10 border border-destructive/20 rounded-[var(--radius)] p-3 text-center">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          id="username"
          name="username"
          label="Username"
          placeholder="username"
          required
          autoFocus
          disabled={loading}
        />
        <Input
          type="password"
          id="password"
          name="password"
          label="Password"
          placeholder="••••••••"
          required
          disabled={loading}
        />

        <label className="font-mono text-xs text-muted-foreground flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="remember"
            value="1"
            disabled={loading}
            className="accent-primary"
          />{" "}
          Remember me for 30 days
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-2"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <Button
        variant="ghost"
        href="/"
        className="font-mono text-[11px] text-muted-foreground no-underline text-center transition-colors duration-150 hover:text-white"
      >
        ← Back to site
      </Button>
    </div>
  );
}
