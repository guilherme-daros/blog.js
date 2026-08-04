import prisma from "@/lib/prisma";
import { Metadata } from "next";
import PostForm from "@/components/admin/PostForm";

import AdminPageLayout from "@/components/admin/AdminPageLayout";

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
    <AdminPageLayout title="New Post" count={0} itemName="" action={null}>
      <PostForm tags={tags} />
    </AdminPageLayout>
  );
}
