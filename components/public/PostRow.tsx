import Link from"next/link";
import type { Post } from"@prisma/client";

interface PostRowProps {
  post: Post;
}

/**
 * Shared post list row used by Archive and Search pages.
 */
export default function PostRow({ post }: PostRowProps) {
  const date = new Date(post.published_at);

  return (
    <Link href={`/post/${post.slug}`} className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]-item">
      <div className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]-item-date">
        <span className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]-month">
          {date.toLocaleString("default", { month:"short" })}
        </span>
        <span className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]-day">
          {date.toLocaleString("default", { day:"2-digit" })}
        </span>
      </div>

      <div className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]-item-body">
        <div className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]-item-meta">
          <span className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]-category">
            <span className="bracket">[</span> {post.tag}{""}
            <span className="bracket">]</span>
          </span>
          <span className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]-separator">—</span>
          <span className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]-readtime">{post.read_time} min read</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
      </div>

      <div className="max-w-[960px] mx-auto px-6 pt-[80px] pb-20 max-[820px]:pt-[120px]-item-arrow">→</div>
    </Link>
  );
}
