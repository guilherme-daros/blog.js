import Link from "next/link";
import prisma from "@/lib/prisma";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  return {
    title: `Search${query ? ` "${query}"` : ""} — Terminal Blog`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";

  let results: any[] = [];
  if (query) {
    // Format query for Postgres to search for any of the words
    const searchQuery = query.trim().split(/\s+/).join(' | ');

    results = await prisma.post.findMany({
      where: {
        OR: [
          { title: { search: searchQuery } },
          { excerpt: { search: searchQuery } },
          { content: { search: searchQuery } },
        ],
      },
      orderBy: { id: "desc" },
    });
  }

  return (
    <section className="search-page">
      <header className="search-header">
        <form className="search-form-large" action="/search" method="GET">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search posts..."
            autoFocus
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        {query && (
          <p className="search-count">
            {results.length} result{results.length !== 1 ? "s" : ""} for "
            {query}"
          </p>
        )}
      </header>

      {results.length > 0 ? (
        <div className="archive-list">
          {results.map((post) => {
            const date = new Date(post.published_at);
            return (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="archive-item"
              >
                <div className="archive-item-date">
                  <span className="archive-month">
                    {date.toLocaleString("default", { month: "short" })}
                  </span>
                  <span className="archive-day">
                    {date.toLocaleString("default", { day: "2-digit" })}
                  </span>
                </div>
                <div className="archive-item-body">
                  <div className="archive-item-meta">
                    <span className="archive-category">
                      <span className="bracket">[</span> {post.tag}{" "}
                      <span className="bracket">]</span>
                    </span>
                    <span className="archive-separator">—</span>
                    <span className="archive-readtime">
                      {post.read_time} min read
                    </span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
                <div className="archive-item-arrow">→</div>
              </Link>
            );
          })}
        </div>
      ) : query ? (
        <p className="admin-empty" style={{color: "var(--muted-foreground)"}}>
          No posts match your search. Try different keywords.
        </p>
      ) : null}
    </section>
  );
}
