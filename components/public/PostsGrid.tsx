"use client";

import { useRef } from "react";
import { Post } from "@prisma/client";
import PostCard from "./PostCard";

export default function PostsGrid({ posts }: { posts: Post[] }) {
  const scrollTargetRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<any>(null);

  const handleScroll = (
    e: React.MouseEvent<HTMLButtonElement>,
    dir: number
  ) => {
    const track = e.currentTarget
      .closest(".posts-section")
      ?.querySelector(".posts-carousel-track") as HTMLElement;
    if (!track) return;

    const card = track.querySelector(".post-card") as HTMLElement;
    if (!card) return;

    const step = card.offsetWidth;
    const maxScroll = track.scrollWidth - track.clientWidth;

    // Use current scroll position if not currently animating programmatically
    let baseScroll = track.scrollLeft;
    if (scrollTargetRef.current !== null) {
      baseScroll = scrollTargetRef.current;
    } else {
      // Round current scroll Left to nearest step to handle manual swipe subpixel offsets
      baseScroll = Math.round(track.scrollLeft / step) * step;
    }

    const target = Math.max(0, Math.min(baseScroll + (dir * step), maxScroll));
    scrollTargetRef.current = target;

    track.scrollTo({ left: target, behavior: "smooth" });

    // Clear target ref after scrolling animation finishes
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      scrollTargetRef.current = null;
    }, 450);
  };

  return (
    <section className="posts-section py-12 max-w-[80rem] mx-auto px-6" id="posts">
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-xl font-normal text-neutral-950 dark:text-white">Latest Posts</h2>
        <div>
          {posts.length > 3 && (
            <div className="flex gap-2">
              <button
                className="font-mono text-xs text-muted-foreground bg-surface border border-border hover:border-zinc-400 dark:hover:border-zinc-700 hover:text-neutral-950 dark:hover:text-white rounded-[var(--radius)] w-8 h-8 flex items-center justify-center cursor-pointer transition-colors duration-150"
                onClick={(e) => handleScroll(e, -1)}
                aria-label="Previous"
              >
                &larr;
              </button>
              <button
                className="font-mono text-xs text-muted-foreground bg-surface border border-border hover:border-zinc-400 dark:hover:border-zinc-700 hover:text-neutral-950 dark:hover:text-white rounded-[var(--radius)] w-8 h-8 flex items-center justify-center cursor-pointer transition-colors duration-150"
                onClick={(e) => handleScroll(e, 1)}
                aria-label="Next"
              >
                &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
      {posts.length > 3 ? (
        <div className="posts-carousel-track grid grid-flow-col auto-cols-[33.333%] max-[1024px]:auto-cols-[50%] max-[640px]:auto-cols-[100%] gap-0 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1" id="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
