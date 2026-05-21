"use client";

import { useState, useActionState } from "react";
import { createPost, updatePost, ActionState } from "@/app/actions/admin";
import Link from "next/link";
import { Post } from "@prisma/client";

export default function PostForm({
  post,
  tags,
}: {
  post?: Post | null;
  tags: string[];
}) {
  const [slugEdited, setSlugEdited] = useState(!!post);
  const [slug, setSlug] = useState(post?.slug || "");

  // Bind the id if we are updating
  const actionWithId = post ? updatePost.bind(null, post.id) : createPost;
  
  const [state, formAction, isPending] = useActionState(actionWithId, {
    error: undefined,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!slugEdited) {
      const generatedSlug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  };

  return (
    <form className="admin-form" action={formAction}>
      {state?.error && (
        <div className="admin-error-banner" style={{ marginBottom: "1rem", padding: "0.75rem", background: "rgba(220, 38, 38, 0.1)", border: "1px solid var(--error)", color: "var(--error)", borderRadius: "var(--radius)" }}>
          {state.error}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={post?.title || ""}
            required
            onChange={handleTitleChange}
            disabled={isPending}
          />
        </div>
        <div className="form-group">
          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={slug}
            required
            onFocus={() => setSlugEdited(true)}
            onChange={(e) => setSlug(e.target.value)}
            disabled={isPending}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tag">Tag</label>
          <input
            type="text"
            id="tag"
            name="tag"
            defaultValue={post?.tag || ""}
            list="tag-list"
            required
            disabled={isPending}
          />
          <datalist id="tag-list">
            {tags.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        <div className="form-group">
          <label htmlFor="read_time">Read time (min)</label>
          <input
            type="number"
            id="read_time"
            name="read_time"
            defaultValue={post?.read_time || 5}
            min="1"
            disabled={isPending}
          />
        </div>
        <div className="form-group">
          <label htmlFor="published_at">Published date</label>
          <input
            type="date"
            id="published_at"
            name="published_at"
            defaultValue={post?.published_at ? new Date(post.published_at).toISOString().split('T')[0] : ""}
            required
            disabled={isPending}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="excerpt">Excerpt</label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          required
          defaultValue={post?.excerpt || ""}
          disabled={isPending}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="content">Content (HTML)</label>
        <textarea
          id="content"
          name="content"
          rows={16}
          defaultValue={post?.content || ""}
          disabled={isPending}
        ></textarea>
      </div>
      <div className="admin-form-actions">
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "Saving..." : post ? "Save changes" : "Create post"}
        </button>
        <Link href="/admin/posts" className="btn btn-outline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
