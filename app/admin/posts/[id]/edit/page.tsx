import prisma from "@/lib/prisma";
import { Metadata } from "next";
import PostForm from "@/components/admin/PostForm";
import { notFound } from "next/navigation";

import AdminPageLayout from "@/components/admin/AdminPageLayout";

export const metadata: Metadata = {
  title: "Edit Post — Terminal Admin",
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post) {
    notFound();
  }

  const tagsResult = await prisma.post.findMany({
    select: { tag: true },
    distinct: ["tag"],
  });
  const tags = tagsResult.map((t) => t.tag);

  return (
    <AdminPageLayout title="Edit Post" count={0} itemName="" action={null}>
      <PostForm post={post} tags={tags} />
    </AdminPageLayout>
  );
}
