import Link from "next/link";
import prisma from "@/lib/prisma";

import BackToTop from "@/components/public/BackToTop";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const socialLinks = await prisma.socialLink.findMany({
    orderBy: { sort_order: "asc" },
  });

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo">
            Terminal<span>.</span>blog
          </Link>
          <nav className="header-nav">
            <ul className="nav-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/archive">Archive</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
          <form className="header-search" action="/search" method="GET">
            <input type="text" name="q" placeholder="Search..." aria-label="Search" />
          </form>
        </div>
      </header>

      {children}

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-copy">
            &copy; 2026 Terminal Blog &mdash; All rights reserved
          </span>
          <ul className="footer-links">
            {socialLinks.map((link) => (
              <li key={link.id}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>

      <BackToTop />
    </>
  );
}
