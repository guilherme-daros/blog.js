import Link from "next/link";
import prisma from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive — Terminal Blog",
};

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { tag, page } = await searchParams;

  const tagFilter = typeof tag === "string" ? tag : undefined;
  const currentPage = typeof page === "string" ? parseInt(page) : 1;
  const PER_PAGE = 15;

  const totalPosts = await prisma.post.count({
    where: tagFilter ? { tag: tagFilter } : undefined,
  });

  const totalPages = Math.ceil(totalPosts / PER_PAGE);

  const posts = await prisma.post.findMany({
    where: tagFilter ? { tag: tagFilter } : undefined,
    orderBy: { id: "desc" },
    skip: (currentPage - 1) * PER_PAGE,
    take: PER_PAGE,
  });

  // Get distinct tags
  const tagsResult = await prisma.post.findMany({
    select: { tag: true },
    distinct: ["tag"],
  });
  const tags = tagsResult.map((t) => t.tag);

  return (
    <section className="archive">
      <header className="archive-header">
        <div className="hero-tag">// Archive</div>
        <h1>The full collection</h1>
        <p>Complete list of technical articles, deep dives, and system reviews.</p>
      </header>

      <div className="archive-filters">
        <Link
          href="/archive"
          className={`archive-tag ${!tagFilter ? "active" : ""}`}
        >
          All
        </Link>
        {tags.map((t) => (
          <Link
            key={t}
            href={`/archive?tag=${t}`}
            className={`archive-tag ${tagFilter === t ? "active" : ""}`}
          >
            {t}
          </Link>
        ))}
        <span className="archive-count">
          {totalPosts} article{totalPosts !== 1 ? "s" : ""}
          {totalPages > 1 ? ` · page ${currentPage} of ${totalPages}` : ""}
        </span>
      </div>

      <div className="archive-list">
        {posts.map((post) => {
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

      {totalPages > 1 && (
        <nav className="pagination">
          {currentPage > 1 ? (
            <Link
              href={`/archive?${new URLSearchParams({
                ...(tagFilter ? { tag: tagFilter } : {}),
                page: (currentPage - 1).toString(),
              }).toString()}`}
              className="pagination-btn"
            >
              ← Prev
            </Link>
          ) : (
            <span className="pagination-btn disabled">← Prev</span>
          )}

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/archive?${new URLSearchParams({
                  ...(tagFilter ? { tag: tagFilter } : {}),
                  page: p.toString(),
                }).toString()}`}
                className={`pagination-page ${p === currentPage ? "active" : ""}`}
              >
                {p}
              </Link>
            ))}
          </div>

          {currentPage < totalPages ? (
            <Link
              href={`/archive?${new URLSearchParams({
                ...(tagFilter ? { tag: tagFilter } : {}),
                page: (currentPage + 1).toString(),
              }).toString()}`}
              className="pagination-btn"
            >
              Next →
            </Link>
          ) : (
            <span className="pagination-btn disabled">Next →</span>
          )}
        </nav>
      )}
    </section>
  );
}
