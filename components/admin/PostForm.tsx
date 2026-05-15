"use client";

import { useState } from "react";
import { createPost, updatePost } from "@/app/actions/admin";
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
  const [isSaving, setIsSaving] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!slugEdited) {
      const generatedSlug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleAction = async (formData: FormData) => {
    setIsSaving(true);
    if (post) {
      await updatePost(post.id, formData);
    } else {
      await createPost(formData);
    }
  };

  return (
    <form className="admin-form" action={handleAction}>
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
            disabled={isSaving}
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
            disabled={isSaving}
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
            disabled={isSaving}
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
            disabled={isSaving}
          />
        </div>
        <div className="form-group">
          <label htmlFor="published_at">Published date</label>
          <input
            type="date"
            id="published_at"
            name="published_at"
            defaultValue={post?.published_at || ""}
            required
            disabled={isSaving}
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
          disabled={isSaving}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="content">Content (HTML)</label>
        <textarea
          id="content"
          name="content"
          rows={16}
          defaultValue={post?.content || ""}
          disabled={isSaving}
        ></textarea>
      </div>
      <div className="admin-form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? "Saving..." : post ? "Save changes" : "Create post"}
        </button>
        <Link href="/admin/posts" className="btn btn-outline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
