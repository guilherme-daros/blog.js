import styles from "./Footer.module.css";

export default function Footer({ socialLinks }: { socialLinks: any[] }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>
          &copy; 2026 Terminal Blog &mdash; All rights reserved
        </span>
        <ul className={styles.links}>
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
  );
}
