"use client";

import { Post } from "@prisma/client";
import PostCard from "./PostCard";

export default function PostsGrid({ posts }: { posts: Post[] }) {
  const handleScroll = (
    e: React.MouseEvent<HTMLButtonElement>,
    dir: number
  ) => {
    const track = e.currentTarget
      .closest(".posts-section")
      ?.querySelector(".posts-carousel-track");
    if (!track) return;
    const card = track.querySelector(".post-card") as HTMLElement;
    if (!card) return;
    const step = card.offsetWidth + 1;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="posts-section" id="posts">
      <div className="section-header">
        <h2>Latest Posts</h2>
        <div className="section-header-actions">
          {posts.length > 3 && (
            <div className="carousel-nav">
              <button
                className="carousel-btn"
                onClick={(e) => handleScroll(e, -1)}
                aria-label="Previous"
              >
                ←
              </button>
              <button
                className="carousel-btn"
                onClick={(e) => handleScroll(e, 1)}
                aria-label="Next"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
      {posts.length > 3 ? (
        <div className="posts-carousel-track">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="posts-grid" id="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
