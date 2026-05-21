import Link from "next/link";
import { Post } from "@prisma/client";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <div className="post-meta">
        <Link href={`/archive?tag=${post.tag}`} className="tag tag-filter">
          {post.tag}
        </Link>
        <span>{new Date(post.published_at).toLocaleDateString()}</span>
      </div>
      <h3>
        <Link href={`/post/${post.slug}`} className="post-link">
          {post.title}
        </Link>
      </h3>
      <p>{post.excerpt}</p>
      <div className="post-stats">
        <span>{post.read_time} min</span>
        <span className={post.reads_trend === "up" ? "positive" : "negative"}>
          {post.reads_trend === "up" ? "↑" : "↓"} {post.reads} reads
        </span>
      </div>
    </article>
  );
}
