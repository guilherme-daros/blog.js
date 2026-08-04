export default function Footer({ socialLinks }: { socialLinks: any[] }) {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-[80rem] mx-auto flex justify-between items-center max-[640px]:flex-col max-[640px]:gap-4">
        <span className="font-mono text-[11px] text-muted-foreground">
          &copy; 2026 Terminal Blog &mdash; All rights reserved
        </span>
        <ul className="flex gap-6 list-none p-0 m-0">
          {socialLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-muted-foreground no-underline uppercase tracking-[1px] transition-colors duration-200 hover:text-neutral-950 dark:hover:text-white"
              >
                {link.platform}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
