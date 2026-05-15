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

      <article className="article">
        <header className="article-header">
          <Link href="/" className="article-back">
            ← Back to blog
          </Link>
          <div className="post-meta">
            <span className="tag">{post.tag}</span>
            <span>{new Date(post.published_at).toLocaleDateString()}</span>
            <span>&middot;</span>
            <span>{post.read_time} min read</span>
            <span>&middot;</span>
            <span>{post.reads} views</span>
          </div>
          <h1>{post.title}</h1>
          <p className="article-excerpt">{post.excerpt}</p>
          <div className="share-bar">
            <span className="share-label">Share</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                post.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
            >
              Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
            >
              LinkedIn
            </a>
            <CopyLinkButton />
          </div>
        </header>

        <ArticleBody content={post.content} />

        {(prevPost || nextPost) && (
          <nav className="post-nav">
            {prevPost ? (
              <Link href={`/post/${prevPost.slug}`} className="post-nav-link prev">
                <span className="post-nav-dir">← Previous</span>
                <span className="post-nav-title">{prevPost.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link href={`/post/${nextPost.slug}`} className="post-nav-link next">
                <span className="post-nav-dir">Next →</span>
                <span className="post-nav-title">{nextPost.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
      </article>

      {related.length > 0 && (
        <section className="related-section">
          <div className="section-header">
            <h2>More in {post.tag}</h2>
          </div>
          <div className="posts-grid related-grid">
            {related.map((relatedPost) => (
              <PostCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
