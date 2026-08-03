"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayoutClient({
  children,
  role,
  username,
}: {
  children: React.ReactNode;
  role: string;
  username: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItemClass = (href: string) => {
    const isActive =
      href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(href);
    return cn(
      "font-mono text-xs text-muted-foreground no-underline px-6 py-[10px] transition-all duration-150 hover:text-white hover:bg-panel",
      isActive && "text-primary border-r-2 border-primary hover:text-primary"
    );
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden max-w-full bg-background text-foreground">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[45] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "w-[220px] shrink-0 bg-surface border-r border-border flex flex-col p-0 fixed top-0 bottom-0 left-0 z-50 transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Link
          href="/"
          className="font-mono text-sm font-medium text-white no-underline tracking-[1.92px] uppercase px-6 h-14 flex items-center border-b border-border"
        >
          Terminal<span className="text-primary">.</span>admin
        </Link>
        <nav className="flex flex-col py-4 flex-1">
          <Link href="/admin" className={navItemClass("/admin")}>
            Dashboard
          </Link>
          <Link href="/admin/posts" className={navItemClass("/admin/posts")}>
            Posts
          </Link>
          <Link href="/admin/messages" className={navItemClass("/admin/messages")}>
            Messages
          </Link>
          <Link href="/admin/subscribers" className={navItemClass("/admin/subscribers")}>
            Subscribers
          </Link>
          <Link href="/admin/social" className={navItemClass("/admin/social")}>
            Social Links
          </Link>
          {role === "admin" && (
            <Link href="/admin/users" className={navItemClass("/admin/users")}>
              Users
            </Link>
          )}
        </nav>

        <div className="p-3 px-6 border-t border-border flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-[1px] uppercase text-primary border border-primary/30 px-[6px] py-[1px] rounded-[var(--radius)]">
            {role}
          </span>
          <span className="font-mono text-xs text-white">{username}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="font-mono text-[10px] text-muted-foreground no-underline ml-auto transition-colors duration-150 hover:text-destructive bg-transparent border-none cursor-pointer p-0 text-left"
          >
            Logout
          </button>
        </div>

        <Link
          href="/"
          className="font-mono text-[11px] text-muted-foreground no-underline p-4 px-6 border-t border-border transition-colors duration-150 hover:text-primary"
        >
          ← Back to site
        </Link>
      </aside>

      <main className="flex-1 lg:pl-[220px] flex flex-col min-w-0 max-w-full">
        <header className="flex items-center justify-between px-8 max-[1024px]:px-4 h-14 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <button
              className="font-mono text-xs text-muted-foreground bg-transparent border border-border rounded-[var(--radius)] px-3 py-1 cursor-pointer transition-colors duration-150 hover:text-white hover:border-[#444] lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              MENU
            </button>
            <h1 id="admin-page-title" className="text-xl font-normal text-white">
              Admin
            </h1>
          </div>
          <div className="flex items-center gap-2" id="admin-actions"></div>
        </header>
        <div className="p-8 max-[1024px]:p-4 flex-1 overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
