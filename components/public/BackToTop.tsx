"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      id="back-to-top"
      className="fixed bottom-6 right-6 z-50 bg-surface border border-border text-muted-foreground hover:text-neutral-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-700 rounded-[var(--radius)] w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      &uarr;
    </button>
  );
}
