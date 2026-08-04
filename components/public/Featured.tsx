import Link from "next/link";
import { Post } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";

export default function Featured({ post }: { post: Post }) {
  return (
    <section className="py-12 max-w-[80rem] mx-auto px-6">
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-xl font-normal text-white">Featured</h2>
        <Link
          href="/archive"
          className="font-mono text-xs text-muted-foreground hover:text-white transition-colors no-underline uppercase tracking-[1px]"
        >
          View all posts
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-0 bg-surface border border-border rounded-[var(--radius)] overflow-hidden max-[1024px]:grid-cols-1">
        <div className="p-12 flex flex-col justify-between max-[640px]:p-8 border-r border-border max-[1024px]:border-r-0 max-[1024px]:border-b">
          <div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono mb-4">
              <Link href={`/archive?tag=${post.tag}`} className="no-underline">
                <Badge variant="primary">
                  {post.tag}
                </Badge>
              </Link>
              <span>{new Date(post.published_at).toLocaleDateString()}</span>
              <span>&middot;</span>
              <span>{post.read_time} min read</span>
            </div>
            <h3 className="text-2xl font-medium text-white mb-4 leading-tight">
              <Link href={`/post/${post.slug}`} className="hover:text-primary transition-colors no-underline">
                {post.title}
              </Link>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              {post.excerpt}
            </p>
          </div>
          <div>
            <Link
              href={`/post/${post.slug}`}
              className="inline-flex items-center gap-2 font-mono text-xs text-white hover:text-primary transition-colors uppercase tracking-[1px] no-underline"
            >
              Read full article <span className="text-primary font-sans">&rarr;</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-panel p-8 flex items-center justify-center font-mono text-xs text-muted-foreground min-h-[300px] select-none">
          <div className="w-full max-w-[440px] space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-white font-medium">status_check.sh</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
                <span className="text-[10px] tracking-[0.5px] uppercase text-[#16a34a]">system online</span>
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] leading-relaxed">
              <div className="flex justify-between">
                <span>POST_ID</span>
                <span className="text-white">{post.id}</span>
              </div>
              <div className="flex justify-between">
                <span>READ_TIME</span>
                <span className="text-white">{post.read_time} min</span>
              </div>
              <div className="flex justify-between">
                <span>TOTAL_READS</span>
                <span className="text-white">{post.reads}</span>
              </div>
              <div className="flex justify-between">
                <span>TRENDING</span>
                <span className={post.reads_trend === "up" ? "text-[#16a34a]" : "text-destructive"}>
                  {post.reads_trend === "up" ? "ACTIVE / ASCENDING" : "STABLE / CONSOLIDATING"}
                </span>
              </div>
            </div>
            <div className="border-t border-border/40 pt-4 flex gap-2">
              <div className="bg-surface border border-border/60 rounded px-2.5 py-1 text-[10px] tracking-[0.5px] uppercase text-white">
                tag: {post.tag}
              </div>
              <div className="bg-surface border border-border/60 rounded px-2.5 py-1 text-[10px] tracking-[0.5px] uppercase text-white">
                type: markdown
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
