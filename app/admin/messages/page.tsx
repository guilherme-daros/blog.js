import prisma from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";
import MessageItem from "@/components/admin/MessageItem";

export const metadata: Metadata = {
  title: "Messages — Terminal Admin",
};

export default async function AdminMessages({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { unread_first } = await searchParams;
  const isUnreadFirst = unread_first === "1";

  const messages = await prisma.message.findMany({
    orderBy: isUnreadFirst ? [{ read: "asc" }, { id: "desc" }] : { id: "desc" },
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
          <h2 style={{ margin: 0 }}>Messages</h2>
          <span className="admin-count" style={{ margin: 0 }}>
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link
            href={`/admin/messages${!isUnreadFirst ? "?unread_first=1" : ""}`}
            className={`btn btn-outline ${isUnreadFirst ? "btn-active" : ""}`}
          >
            {isUnreadFirst ? "All" : "New"}
          </Link>
          <Link
            href={`/admin/messages${isUnreadFirst ? "?unread_first=1" : ""}`}
            className="btn btn-outline"
          >
            Refresh
          </Link>
        </div>
      </div>

      <div id="message-list-wrap">
        {messages.length > 0 ? (
          <div className="admin-message-list">
            <div className="admin-message-list-header">
              <span>Subject</span>
              <span>Date</span>
            </div>
            {messages.map((msg) => (
              <MessageItem key={msg.id} msg={msg} />
            ))}
          </div>
        ) : (
          <p className="admin-empty">No messages yet.</p>
        )}
      </div>
    </>
  );
}
