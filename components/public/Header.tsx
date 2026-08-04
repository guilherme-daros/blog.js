"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  const pathname = usePathname();

  const linkClass =
    "font-mono text-[11px] leading-[16.5px] no-underline uppercase tracking-[1.5px] transition-colors duration-200 inline-block before:content-['['] before:mr-[0.25em] before:opacity-0 before:transition-opacity before:duration-200 before:inline-block hover:before:opacity-100 hover:before:text-primary after:content-[']'] after:ml-[0.25em] after:opacity-0 after:transition-opacity after:duration-200 after:inline-block hover:after:opacity-100 hover:after:text-primary";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-[80rem] mx-auto px-6 py-3 flex flex-wrap items-center gap-x-8 gap-y-2 max-[820px]:gap-y-3">
        <Link
          href="/"
          className="font-mono text-sm font-medium text-neutral-950 dark:text-white no-underline tracking-[1.92px] uppercase order-0 max-[820px]:flex-1"
        >
          Terminal<span className="text-primary">.</span>blog
        </Link>
        <nav className="order-0 max-[820px]:order-2 max-[820px]:w-full">
          <ul className="flex gap-8 list-none max-[820px]:justify-center max-[820px]:gap-6 p-0 m-0">
            <li>
              <Link
                href="/"
                className={`${linkClass} ${
                  pathname === "/" ? "text-neutral-950 dark:text-white" : "text-muted-foreground hover:text-neutral-950 dark:hover:text-white"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/archive"
                className={`${linkClass} ${
                  pathname === "/archive" ? "text-neutral-950 dark:text-white" : "text-muted-foreground hover:text-neutral-950 dark:hover:text-white"
                }`}
              >
                Archive
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`${linkClass} ${
                  pathname === "/about" ? "text-neutral-950 dark:text-white" : "text-muted-foreground hover:text-neutral-950 dark:hover:text-white"
                }`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`${linkClass} ${
                  pathname === "/contact" ? "text-neutral-950 dark:text-white" : "text-muted-foreground hover:text-neutral-950 dark:hover:text-white"
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="order-1 ml-auto flex items-center gap-3">
          <form action="/search" method="GET">
            <input
              type="text"
              name="q"
              placeholder="Search..."
              aria-label="Search"
              className="font-mono text-xs text-foreground bg-background border border-border rounded-[var(--radius)] py-[6px] px-3 w-40 outline-none transition-all duration-200 focus:border-primary focus:w-[220px] placeholder:text-muted-foreground"
            />
          </form>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
