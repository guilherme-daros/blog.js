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
    <section className="max-w-[80rem] mx-auto px-6 pt-[100px] pb-20 max-[820px]:pt-[120px]">
      <header className="mb-8">
        <form className="flex gap-0 mb-4 max-[640px]:flex-col" action="/search" method="GET">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search posts..."
            autoFocus
          />
          <button type="submit" className="font-mono text-[12px] font-normal leading-[18px] tracking-[1.92px] uppercase no-underline inline-flex items-center justify-center px-7 py-3 rounded-[var(--radius)] cursor-pointer transition-all duration-200 bg-primary text-white border border-primary hover:bg-[#e05e00] hover:border-[#e05e00]">
            Search
          </button>
        </form>
        {query && (
          <p className="font-mono text-[12px] text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""} for "
            {query}"
          </p>
        )}
      </header>

      {results.length > 0 ? (
        <div className="flex flex-col">
          {results.map((post) => {
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
      ) : query ? (
        <p className="admin-empty" style={{color: "var(--muted-foreground)"}}>
          No posts match your search. Try different keywords.
        </p>
      ) : null}
    </section>
  );
}
