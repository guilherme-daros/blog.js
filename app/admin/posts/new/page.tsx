import prisma from "@/lib/prisma";
import { Metadata } from "next";
import PostForm from "@/components/admin/PostForm";

export const metadata: Metadata = {
  title: "New Post — Terminal Admin",
};

export default async function NewPostPage() {
  const tagsResult = await prisma.post.findMany({
    select: { tag: true },
    distinct: ["tag"],
  });
  const tags = tagsResult.map((t) => t.tag);

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <h2>New Post</h2>
      </div>
      <PostForm tags={tags} />
    </>
  );
}
