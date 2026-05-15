"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

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

  return (
    <div className={`admin-body ${sidebarOpen ? "sidebar-open" : ""}`}>
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className="admin-sidebar" id="admin-sidebar">
        <Link href="/" className="admin-logo">
          Terminal<span>.</span>admin
        </Link>
        <nav className="admin-nav">
          <Link
            href="/admin"
            className={`admin-nav-item ${
              pathname === "/admin" ? "active" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/posts"
            className={`admin-nav-item ${
              pathname.startsWith("/admin/posts") ? "active" : ""
            }`}
          >
            Posts
          </Link>
          <Link
            href="/admin/messages"
            className={`admin-nav-item ${
              pathname.startsWith("/admin/messages") ? "active" : ""
            }`}
          >
            Messages
          </Link>
          <Link
            href="/admin/subscribers"
            className={`admin-nav-item ${
              pathname.startsWith("/admin/subscribers") ? "active" : ""
            }`}
          >
            Subscribers
          </Link>
          <Link
            href="/admin/social"
            className={`admin-nav-item ${
              pathname.startsWith("/admin/social") ? "active" : ""
            }`}
          >
            Social Links
          </Link>
          {role === "admin" && (
            <Link
              href="/admin/users"
              className={`admin-nav-item ${
                pathname.startsWith("/admin/users") ? "active" : ""
              }`}
            >
              Users
            </Link>
          )}
        </nav>

        <div className="admin-user-info">
          <span className="admin-role">{role}</span>
          <span className="admin-username">{username}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="admin-logout"
            style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
          >
            Logout
          </button>
        </div>

        <Link href="/" className="admin-back">
          ← Back to site
        </Link>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              MENU
            </button>
            <h1 id="admin-page-title">Admin</h1>
          </div>
          <div className="admin-topbar-actions" id="admin-actions"></div>
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
