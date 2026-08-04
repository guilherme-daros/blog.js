import Link from "next/link";
import { Post } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";

export default function PostCard({ post }: { post: Post }) {
  const isTrendUp = post.reads_trend === "up";

  return (
    <article className="post-card flex flex-col justify-between p-6 bg-surface border border-border rounded-[var(--radius)] hover:border-zinc-700 transition-all duration-200 h-full">
      <div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono mb-4">
          <Link href={`/archive?tag=${post.tag}`} className="no-underline">
            <Badge variant="primary">
              {post.tag}
            </Badge>
          </Link>
          <span>{new Date(post.published_at).toLocaleDateString()}</span>
        </div>
        <h3 className="text-lg font-medium text-neutral-950 dark:text-white mb-2 leading-snug">
          <Link href={`/post/${post.slug}`} className="hover:text-primary transition-colors no-underline">
            {post.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
          {post.excerpt}
        </p>
      </div>
      <div className="flex justify-between items-center text-xs font-mono text-muted-foreground pt-4 mt-auto">
        <span>{post.read_time} min read</span>
        <span className={isTrendUp ? "text-[#16a34a]" : "text-destructive"}>
          {isTrendUp ? "↑" : "↓"} {post.reads} reads
        </span>
      </div>
    </article>
  );
}
