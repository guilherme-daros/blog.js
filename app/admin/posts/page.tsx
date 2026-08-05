import prisma from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";
import { deletePost, featurePost } from "@/app/actions/admin";
import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminTable from "@/components/admin/AdminTable";

export const metadata: Metadata = {
  title: "Posts — Terminal Admin",
};

export default async function AdminPosts() {
  const posts = await prisma.post.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <AdminPageLayout
      title="Posts"
      count={posts.length}
      itemName="post"
      action={
        <Link href="/admin/posts/new" className="font-mono text-xs uppercase tracking-widest px-3.5 py-1.5 bg-primary text-white border border-primary rounded-[var(--radius)] transition-colors duration-150 hover:bg-[#e05e00] hover:border-[#e05e00] no-underline inline-flex items-center justify-center">
          + New Post
        </Link>
      }
    >
      <AdminTable
        isEmpty={posts.length === 0}
        emptyMessage="No posts found."
        headers={[
          <th>ID</th>,
          <th style={{ width: "100%" }}>Title</th>,
          <th>Tag</th>,
          <th>Date</th>,
          <th>Views</th>,
          <th>Featured</th>,
          <th>Actions</th>,
        ]}
      >
        {posts.map((post) => (
          <tr key={post.id}>
            <td className="mono">{post.id}</td>
            <td>
              <Link href={`/admin/posts/${post.id}/edit`}>{post.title}</Link>
            </td>
            <td>
              <span className="admin-tag">{post.tag}</span>
            </td>
            <td className="mono">{new Date(post.published_at).toISOString().slice(0, 10)}</td>
            <td className="mono">{post.reads}</td>
            <td>
              {post.is_featured ? (
                <span className="font-mono text-[10px] uppercase tracking-[1.92px] text-chart-green border border-chart-green/30 px-2 py-1 rounded-[var(--radius)] inline-flex items-center justify-center whitespace-nowrap">
                  Yes
                </span>
              ) : (
                <form action={async () => {
                  "use server";
                  await featurePost(post.id);
                }}>
                  <button type="submit" className="font-mono text-[11px] bg-transparent text-muted-foreground border border-border rounded-[var(--radius)] px-2 py-1 cursor-pointer transition-colors duration-150 hover:text-[var(--heading-color)] hover:border-[#444]">
                    Feature
                  </button>
                </form>
              )}
            </td>
            <td>
              <div className="flex gap-2">
                <Link href={`/admin/posts/${post.id}/edit`} className="font-mono text-[11px] bg-transparent text-muted-foreground border border-border rounded-[var(--radius)] px-2 py-1 no-underline transition-colors duration-150 hover:text-[var(--heading-color)] hover:border-[#444]">
                  Edit
                </Link>
                <form action={async () => {
                  "use server";
                  await deletePost(post.id);
                }}>
                  <button type="submit" className="font-mono text-[11px] bg-transparent text-destructive border border-destructive rounded-[var(--radius)] px-2 py-1 cursor-pointer transition-colors duration-150 hover:bg-destructive/10">
                    Del
                  </button>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
    </AdminPageLayout>
  );
}
