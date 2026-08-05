import Link from "next/link";
import PublicLayout from "./(public)/layout";

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="max-w-[80rem] mx-auto px-6 pt-[160px] pb-20 text-center">
        <div className="bg-background border border-border rounded-[var(--radius)] px-8 py-6 font-mono text-[13px] leading-[22px] text-left min-w-[320px] mb-8">
          <div className="text-muted-foreground">$ curl terminal.blog/404</div>
          <div className="text-primary">404 Not Found</div>
          <div className="text-muted-foreground">
            The page you're looking for doesn't exist
          </div>
          <div className="text-muted-foreground">or has been moved.</div>
          <div>
            <br />
            <span className="text-muted-foreground">$</span>{" "}
            <span className="cursor-blink"></span>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="font-mono text-[12px] font-normal leading-[18px] tracking-[1.92px] uppercase no-underline inline-flex items-center justify-center px-7 py-3 rounded-[var(--radius)] cursor-pointer transition-all duration-200 bg-primary text-white border border-primary hover:bg-[#e05e00] hover:border-[#e05e00]">
            Go home
          </Link>
          <Link href="/archive" className="font-mono text-[12px] font-normal leading-[18px] tracking-[1.92px] uppercase no-underline inline-flex items-center justify-center px-7 py-3 rounded-[var(--radius)] cursor-pointer transition-all duration-200 bg-transparent text-foreground border border-border hover:border-primary hover:text-primary hover:bg-panel">
            Browse archive
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
