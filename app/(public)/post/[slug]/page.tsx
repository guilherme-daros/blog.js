import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  ReadingProgress,
  CopyLinkButton,
  ArticleBody,
} from "@/components/public/ArticleClient";
import PostCard from "@/components/public/PostCard";
import { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: `${post.title} — Terminal Blog`,
    description: post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  // Find previous and next posts (based on ID)
  const prevPost = await prisma.post.findFirst({
    where: { id: { lt: post.id } },
    orderBy: { id: "desc" },
  });

  const nextPost = await prisma.post.findFirst({
    where: { id: { gt: post.id } },
    orderBy: { id: "asc" },
  });

  // Find related posts (same tag, exclude current)
  const related = await prisma.post.findMany({
    where: { tag: post.tag, id: { not: post.id } },
    take: 3,
  });

  return (
    <>
      <ReadingProgress />

      <article className="max-w-[960px] mx-auto px-6 pt-[80px] pb-[64px] max-[820px]:pt-[120px]">
        <header className="mb-12 border-b border-border pb-8">
          <Link href="/" className="font-mono text-[11px] tracking-[1.5px] uppercase text-muted-foreground no-underline transition-colors duration-200 inline-block mb-4 hover:text-primary">
            ← Back to blog
          </Link>
          <div className="font-mono text-[12px] tracking-[-0.24px] text-muted-foreground mb-4 flex items-center gap-3 text-xs">
            <Link href={`/archive?tag=${post.tag}`} className="no-underline">
              <Badge variant="primary">{post.tag}</Badge>
            </Link>
            <span>{new Date(post.published_at).toLocaleDateString()}</span>
            <span>&middot;</span>
            <span>{post.read_time} min read</span>
            <span>&middot;</span>
            <span>{post.reads} views</span>
          </div>
          <h1>{post.title}</h1>
          <p className="text-[18px] leading-[28px] text-muted-foreground">{post.excerpt}</p>
          <div className="flex items-center gap-3 mt-6 max-[640px]:flex-wrap">
            <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-muted-foreground">Share</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                post.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-muted-foreground bg-transparent border border-border rounded-[var(--radius)] px-3 py-1 cursor-pointer no-underline transition-colors duration-200 hover:border-primary hover:text-primary hover:bg-panel"
            >
              Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-muted-foreground bg-transparent border border-border rounded-[var(--radius)] px-3 py-1 cursor-pointer no-underline transition-colors duration-200 hover:border-primary hover:text-primary hover:bg-panel"
            >
              LinkedIn
            </a>
            <CopyLinkButton />
          </div>
        </header>

        <ArticleBody content={post.content} />

        {(prevPost || nextPost) && (
          <nav className="grid grid-cols-2 gap-[1px] bg-border border border-border rounded-[var(--radius)] mt-12 max-[640px]:grid-cols-1">
            {prevPost ? (
              <Link href={`/post/${prevPost.slug}`} className="bg-surface px-6 py-5 no-underline transition-colors duration-150 hover:bg-panel prev">
                <span className="block font-mono text-[10px] tracking-[1.5px] uppercase text-primary mb-1">← Previous</span>
                <span className="block text-[14px] text-[var(--heading-color)] leading-[20px]">{prevPost.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link href={`/post/${nextPost.slug}`} className="bg-surface px-6 py-5 no-underline transition-colors duration-150 hover:bg-panel text-right">
                <span className="block font-mono text-[10px] tracking-[1.5px] uppercase text-primary mb-1">Next →</span>
                <span className="block text-[14px] text-[var(--heading-color)] leading-[20px]">{nextPost.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
      </article>

      {related.length > 0 && (
        <section className="max-w-[960px] mx-auto px-6 pb-20">
          <div className="flex items-baseline justify-between mb-8 border-b border-border pb-4">
            <h2>More in {post.tag}</h2>
          </div>
          <div className="posts-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 max-[640px]:grid-cols-1">
            {related.map((relatedPost) => (
              <PostCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
