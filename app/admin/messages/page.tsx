import prisma from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";
import MessageItem from "@/components/admin/MessageItem";
import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminTable from "@/components/admin/AdminTable";

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
    <AdminPageLayout
      title="Messages"
      count={messages.length}
      itemName="message"
      action={
        <>
          <Link
            href={`/admin/messages${!isUnreadFirst ? "?unread_first=1" : ""}`}
            className={`font-mono text-xs uppercase tracking-widest px-3 py-1.5 border rounded-[var(--radius)] transition-colors duration-150 no-underline inline-flex items-center justify-center ${
              isUnreadFirst
                ? "border-primary text-primary bg-panel"
                : "border-border text-foreground hover:border-primary hover:text-primary hover:bg-panel"
            }`}
          >
            {isUnreadFirst ? "All" : "New"}
          </Link>
          <Link
            href={`/admin/messages${isUnreadFirst ? "?unread_first=1" : ""}`}
            className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-border text-foreground rounded-[var(--radius)] transition-colors duration-150 hover:border-primary hover:text-primary hover:bg-panel no-underline inline-flex items-center justify-center"
          >
            Refresh
          </Link>
        </>
      }
    >
      <AdminTable
        isEmpty={messages.length === 0}
        emptyMessage="No messages yet."
        headers={[
          <th key="id">ID</th>,
          <th style={{ width: "100%" }} key="sub">Subject</th>,
          <th key="date">Date</th>,
          <th style={{ width: "80px" }} key="acts">Actions</th>,
        ]}
      >
        {messages.map((msg) => (
          <MessageItem key={msg.id} msg={msg} />
        ))}
      </AdminTable>
    </AdminPageLayout>
  );
}
