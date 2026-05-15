import prisma from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Terminal Admin",
};

export default async function AdminDashboard() {
  const post_count = await prisma.post.count();
  const msg_count = await prisma.message.count();
  const unread_count = await prisma.message.count({ where: { read: 0 } });
  const sub_count = await prisma.subscriber.count();

  const recent_posts = await prisma.post.findMany({
    orderBy: { id: "desc" },
    take: 5,
  });

  const recent_msgs = await prisma.message.findMany({
    orderBy: { id: "desc" },
    take: 5,
  });

  return (
    <>
      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-label">Posts</span>
          <span className="admin-stat-value">{post_count}</span>
          <Link href="/admin/posts" className="admin-stat-link">
            Manage →
          </Link>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Messages</span>
          <span className="admin-stat-value">{msg_count}</span>
          {unread_count > 0 && (
            <span className="admin-stat-badge">{unread_count} unread</span>
          )}
          <Link href="/admin/messages" className="admin-stat-link">
            View inbox →
          </Link>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Subscribers</span>
          <span className="admin-stat-value">{sub_count}</span>
          <Link href="/admin/subscribers" className="admin-stat-link">
            View list →
          </Link>
        </div>
      </div>

      <div className="admin-grid-2">
        <section>
          <h2 className="admin-section-title">Recent Posts</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Tag</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent_posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <Link href={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </td>
                    <td>
                      <span className="admin-tag">{post.tag}</span>
                    </td>
                    <td className="mono">{post.published_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2 className="admin-section-title">Recent Messages</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent_msgs.map((msg) => (
                  <tr key={msg.id}>
                    <td>
                      {msg.read === 0 && <span className="unread-dot"></span>}
                      {msg.name}
                    </td>
                    <td>{msg.subject || "(no subject)"}</td>
                    <td className="mono">
                      {new Date(msg.created_at).toISOString().slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
