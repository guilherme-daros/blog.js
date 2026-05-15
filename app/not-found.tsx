import Link from "next/link";
import PublicLayout from "./(public)/layout";

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="error-page">
        <div className="terminal-box error-terminal">
          <div className="line-dim">$ curl terminal.blog/404</div>
          <div className="line-orange">404 Not Found</div>
          <div className="line-dim">
            The page you're looking for doesn't exist
          </div>
          <div className="line-dim">or has been moved.</div>
          <div>
            <br />
            <span className="line-dim">$</span>{" "}
            <span className="cursor-blink"></span>
          </div>
        </div>
        <div className="error-actions">
          <Link href="/" className="btn btn-primary">
            Go home
          </Link>
          <Link href="/archive" className="btn btn-outline">
            Browse archive
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
