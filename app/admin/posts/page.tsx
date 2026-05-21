import prisma from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";
import { deletePost, featurePost } from "@/app/actions/admin";

export const metadata: Metadata = {
  title: "Posts — Terminal Admin",
};

export default async function AdminPosts() {
  const posts = await prisma.post.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2>Manage Posts</h2>
        <Link href="/admin/posts/new" className="btn btn-primary">
          + New Post
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Tag</th>
              <th>Date</th>
              <th>Views</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
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
                    <span className="admin-tag" style={{ borderColor: "var(--chart-green)", color: "var(--chart-green)" }}>
                      Yes
                    </span>
                  ) : (
                    <form action={async () => {
                      "use server";
                      await featurePost(post.id);
                    }}>
                      <button type="submit" className="btn-link" style={{ background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer", textDecoration: "underline", fontSize: "12px" }}>
                        Feature
                      </button>
                    </form>
                  )}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link href={`/admin/posts/${post.id}/edit`} className="btn btn-outline" style={{ padding: "4px 8px" }}>
                      Edit
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deletePost(post.id);
                    }}>
                      <button type="submit" className="btn btn-outline" style={{ padding: "4px 8px", borderColor: "var(--error)", color: "var(--error)" }}>
                        Del
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
