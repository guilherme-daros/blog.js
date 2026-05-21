import Link from "next/link";
import { Post } from "@prisma/client";

export default function Featured({ post }: { post: Post }) {
  if (!post) return null;

  return (
    <section className="featured-section">
      <div className="section-header">
        <h2>Featured</h2>
        <Link href="/archive">View all posts</Link>
      </div>
      <div className="featured-card">
        <div className="featured-body">
          <div className="post-meta">
            <Link href={`/archive?tag=${post.tag}`} className="tag tag-filter">{post.tag}</Link>
            <span>{new Date(post.published_at).toLocaleDateString()}</span>
            <span>&middot;</span>
            <span>{post.read_time} min read</span>
          </div>
          <h3>
            <Link href={`/post/${post.slug}`} className="post-link">
              {post.title}
            </Link>
          </h3>
          <p>{post.excerpt}</p>
          <Link href={`/post/${post.slug}`} className="read-more">
            Read article
          </Link>
        </div>
        <div className="featured-image">
          <div className="featured-image-content">
            <div className="terminal-box">
              <div className="line-dim">$ blog scan --sector technology</div>
              <div className="line-green">✓ 47 systems analyzed</div>
              <div className="line-orange">
                ↗ Highest efficiency: System-B +28.4%
              </div>
              <div className="line-dim"> Uptime: 99.99%</div>
              <div className="line-dim"> Error rate: 0.001%</div>
              <div className="line-white">
                {" "}
                Status: <span className="line-green">OPTIMIZED</span>
              </div>
              <div>
                <br />
                <span className="line-dim">$</span>{" "}
                <span className="cursor-blink"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
