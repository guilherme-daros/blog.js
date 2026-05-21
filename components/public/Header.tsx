"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Terminal<span>.</span>blog
        </Link>
        <nav className={styles.nav}>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/" className={pathname === "/" ? styles.active : ""}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/archive"
                className={pathname === "/archive" ? styles.active : ""}
              >
                Archive
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={pathname === "/about" ? styles.active : ""}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={pathname === "/contact" ? styles.active : ""}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <form className={styles.search} action="/search" method="GET">
          <input
            type="text"
            name="q"
            placeholder="Search..."
            aria-label="Search"
          />
        </form>
      </div>
    </header>
  );
}
