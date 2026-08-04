"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-[var(--radius)] border border-border bg-panel hover:bg-surface text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer"
      aria-label="Toggle theme"
      type="button"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-500 shrink-0" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-500 shrink-0" />
      )}
    </button>
  );
}
