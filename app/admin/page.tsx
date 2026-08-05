import prisma from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Terminal Admin",
};

export default async function AdminDashboard() {
  const post_count = await prisma.post.count();
  const msg_count = await prisma.message.count();
  const unread_count = await prisma.message.count({ where: { read: false } });
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-border border border-border rounded-[var(--radius)] mb-8 overflow-hidden">
        <div className="bg-[var(--ide-surface)] p-6 flex flex-col gap-1">
          <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-muted-foreground">Posts</span>
          <span className="font-mono text-[32px] font-medium text-[var(--heading-color)]">{post_count}</span>
          <Link href="/admin/posts" className="font-mono text-[11px] text-muted-foreground no-underline mt-2 transition-colors duration-150 hover:text-primary">
            Manage →
          </Link>
        </div>
        <div className="bg-[var(--ide-surface)] p-6 flex flex-col gap-1">
          <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-muted-foreground">Messages</span>
          <span className="font-mono text-[32px] font-medium text-[var(--heading-color)]">{msg_count}</span>
          {unread_count > 0 && (
            <span className="font-mono text-[11px] text-primary">{unread_count} unread</span>
          )}
          <Link href="/admin/messages" className="font-mono text-[11px] text-muted-foreground no-underline mt-2 transition-colors duration-150 hover:text-primary">
            View inbox →
          </Link>
        </div>
        <div className="bg-[var(--ide-surface)] p-6 flex flex-col gap-1">
          <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-muted-foreground">Subscribers</span>
          <span className="font-mono text-[32px] font-medium text-[var(--heading-color)]">{sub_count}</span>
          <Link href="/admin/subscribers" className="font-mono text-[11px] text-muted-foreground no-underline mt-2 transition-colors duration-150 hover:text-primary">
            View list →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="flex flex-col">
          <h2 className="text-[16px] font-normal text-[var(--heading-color)] mb-4">Recent Posts</h2>
          <div className="border border-border rounded-[var(--radius)] overflow-hidden flex-1 flex flex-col">
            <table className="w-full border-collapse text-[13px] flex-1">
              <thead className="bg-[var(--ide-panel)]">
                <tr>
                  <th className="font-mono text-[12px] tracking-[1.2px] uppercase text-muted-foreground p-[10px_14px] text-left font-normal">Title</th>
                  <th className="font-mono text-[12px] tracking-[1.2px] uppercase text-muted-foreground p-[10px_14px] text-left font-normal">Tag</th>
                  <th className="font-mono text-[12px] tracking-[1.2px] uppercase text-muted-foreground p-[10px_14px] text-left font-normal">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent_posts.map((post) => (
                  <tr key={post.id}>
                    <td className="p-[10px_14px] border-t border-border text-foreground max-w-[280px] truncate">
                      <Link href={`/post/${post.slug}`} className="text-[var(--heading-color)] no-underline transition-colors duration-150 hover:text-primary block truncate">
                        {post.title}
                      </Link>
                    </td>
                    <td className="p-[10px_14px] border-t border-border text-foreground">
                      <span className="font-mono text-[10px] uppercase tracking-[1.92px] text-primary border border-[#ff6b00]/30 px-2 py-1 rounded-[var(--radius)] inline-flex items-center justify-center whitespace-nowrap">{post.tag}</span>
                    </td>
                    <td className="p-[10px_14px] border-t border-border font-mono text-[12px] text-muted-foreground whitespace-nowrap">{new Date(post.published_at).toISOString().slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="flex flex-col">
          <h2 className="text-[16px] font-normal text-[var(--heading-color)] mb-4">Recent Messages</h2>
          <div className="border border-border rounded-[var(--radius)] overflow-hidden flex-1 flex flex-col">
            <table className="w-full border-collapse text-[13px] flex-1">
              <thead className="bg-[var(--ide-panel)]">
                <tr>
                  <th className="font-mono text-[12px] tracking-[1.2px] uppercase text-muted-foreground p-[10px_14px] text-left font-normal">From</th>
                  <th className="font-mono text-[12px] tracking-[1.2px] uppercase text-muted-foreground p-[10px_14px] text-left font-normal">Subject</th>
                  <th className="font-mono text-[12px] tracking-[1.2px] uppercase text-muted-foreground p-[10px_14px] text-left font-normal">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent_msgs.map((msg) => (
                  <tr key={msg.id}>
                    <td className="p-[10px_14px] border-t border-border text-foreground max-w-[280px] truncate">
                      {!msg.read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1.5 align-middle"></span>}
                      {msg.name}
                    </td>
                    <td className="p-[10px_14px] border-t border-border text-foreground max-w-[280px] truncate">{msg.subject || "(no subject)"}</td>
                    <td className="p-[10px_14px] border-t border-border font-mono text-[12px] text-muted-foreground whitespace-nowrap">
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
