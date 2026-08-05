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
    <section className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]">
      <header className="flex flex-col items-start text-left max-w-[640px]">
        <div className="inline-block font-mono text-[12px] tracking-[1.92px] uppercase text-primary border border-primary rounded-[var(--radius)] px-4 py-[6px] mb-8">// Archive</div>
        <h1 className="text-[48px] font-normal leading-[56px] tracking-[-1.5px] text-[var(--heading-color)] mb-6 max-[640px]:text-[28px] max-[640px]:leading-[34px]">The full collection</h1>
        <p>Complete list of technical articles, deep dives, and system reviews.</p>
      </header>

      <div className="flex items-center gap-2 flex-wrap mt-4 mb-4">
        <Link
          href="/archive"
          className={`font-mono text-[10px] tracking-[1.2px] uppercase no-underline border rounded-[var(--radius)] px-3 py-[5px] transition-colors duration-200 ${
            !tagFilter
              ? "text-primary border-primary"
              : "text-muted-foreground border-border hover:text-[var(--heading-color)] hover:border-[#444]"
          }`}
        >
          All
        </Link>
        {tags.map((t) => (
          <Link
            key={t}
            href={`/archive?tag=${t}`}
            className={`font-mono text-[10px] tracking-[1.2px] uppercase no-underline border rounded-[var(--radius)] px-3 py-[5px] transition-colors duration-200 ${
              tagFilter === t
                ? "text-primary border-primary"
                : "text-muted-foreground border-border hover:text-[var(--heading-color)] hover:border-[#444]"
            }`}
          >
            {t}
          </Link>
        ))}
        <span className="font-mono text-[11px] text-muted-foreground ml-auto tracking-[0.5px] uppercase">
          {totalPosts} article{totalPosts !== 1 ? "s" : ""}
          {totalPages > 1 ? ` · page ${currentPage} of ${totalPages}` : ""}
        </span>
      </div>

      <div className="flex flex-col">
        {posts.map((post) => {
          const date = new Date(post.published_at);
          return (
            <Link
              key={post.id}
              href={`/post/${post.slug}`}
              className="group flex items-center gap-8 py-6 border-b border-border no-underline transition-colors duration-150 first:border-t-0 hover:bg-surface hover:-mx-4 hover:px-4 hover:rounded-[var(--radius)] max-[640px]:gap-4"
            >
              <div className="shrink-0 w-12 text-center">
                <span className="block font-mono text-[10px] tracking-[1.2px] uppercase text-primary">
                  {date.toLocaleString("default", { month: "short" })}
                </span>
                <span className="block font-mono text-[22px] font-medium text-[var(--heading-color)] leading-[1.2]">
                  {date.toLocaleString("default", { day: "2-digit" })}
                </span>
              </div>
              <div className="flex-1 min-w-0 [&>p]:whitespace-nowrap [&>p]:overflow-hidden [&>p]:text-ellipsis max-[640px]:[&>p]:whitespace-normal">
                <div className="font-mono text-[12px] tracking-[-0.24px] flex items-center gap-2 mb-1">
                  <span className="text-foreground uppercase text-[10px] tracking-[1.2px] [&>.bracket]:text-primary">
                    <span className="bracket">[</span> {post.tag}{" "}
                    <span className="bracket">]</span>
                  </span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-muted-foreground">
                    {post.read_time} min read
                  </span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
              <div className="shrink-0 font-mono text-[16px] text-muted-foreground transition-all duration-200 group-hover:text-primary group-hover:translate-x-1">→</div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-border">
          {currentPage > 1 ? (
            <Link
              href={`/archive?${new URLSearchParams({
                ...(tagFilter ? { tag: tagFilter } : {}),
                page: (currentPage - 1).toString(),
              }).toString()}`}
              className="font-mono text-[11px] text-muted-foreground no-underline px-[14px] py-[6px] border border-border rounded-[var(--radius)] transition-colors duration-150 hover:text-[var(--heading-color)] hover:border-[#444]"
            >
              ← Prev
            </Link>
          ) : (
            <span className="font-mono text-[11px] text-muted-foreground no-underline px-[14px] py-[6px] border border-border rounded-[var(--radius)] transition-colors duration-150 hover:text-[var(--heading-color)] hover:border-[#444] opacity-30 pointer-events-none">← Prev</span>
          )}

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/archive?${new URLSearchParams({
                  ...(tagFilter ? { tag: tagFilter } : {}),
                  page: p.toString(),
                }).toString()}`}
                className={`font-mono text-[12px] no-underline w-8 h-8 flex items-center justify-center rounded-[var(--radius)] transition-colors duration-150 ${
                  p === currentPage
                    ? "text-primary bg-surface border border-primary"
                    : "text-muted-foreground hover:text-[var(--heading-color)] hover:bg-surface"
                }`}
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
              className="font-mono text-[11px] text-muted-foreground no-underline px-[14px] py-[6px] border border-border rounded-[var(--radius)] transition-colors duration-150 hover:text-[var(--heading-color)] hover:border-[#444]"
            >
              Next →
            </Link>
          ) : (
            <span className="font-mono text-[11px] text-muted-foreground no-underline px-[14px] py-[6px] border border-border rounded-[var(--radius)] transition-colors duration-150 hover:text-[var(--heading-color)] hover:border-[#444] opacity-30 pointer-events-none">Next →</span>
          )}
        </nav>
      )}
    </section>
  );
}
