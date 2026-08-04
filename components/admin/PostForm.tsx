"use client";

import { useState, useActionState } from "react";
import { createPost, updatePost } from "@/app/actions/admin";
import { Post } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";

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
    <form className="space-y-6" action={formAction}>
      {state?.error && (
        <Alert variant="destructive" className="mb-4">
          {state.error}
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          id="title"
          name="title"
          label="Title"
          defaultValue={post?.title || ""}
          required
          onChange={handleTitleChange}
          disabled={isPending}
          className="w-full"
        />
        <Input
          type="text"
          id="slug"
          name="slug"
          label="Slug"
          value={slug}
          required
          onFocus={() => setSlugEdited(true)}
          onChange={(e) => setSlug(e.target.value)}
          disabled={isPending}
          className="w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <Input
            type="text"
            id="tag"
            name="tag"
            label="Tag"
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
        <Input
          type="number"
          id="read_time"
          name="read_time"
          label="Read time (min)"
          defaultValue={post?.read_time || 5}
          min="1"
          disabled={isPending}
          className="w-full"
        />
        <Input
          type="date"
          id="published_at"
          name="published_at"
          label="Published date"
          defaultValue={
            post?.published_at
              ? new Date(post.published_at).toISOString().split("T")[0]
              : ""
          }
          required
          disabled={isPending}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          required
          defaultValue={post?.excerpt || ""}
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Content (HTML)</Label>
        <Textarea
          id="content"
          name="content"
          rows={16}
          defaultValue={post?.content || ""}
          disabled={isPending}
        />
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : post ? "Save changes" : "Create post"}
        </Button>
        <Button variant="outline" href="/admin/posts" type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
}
