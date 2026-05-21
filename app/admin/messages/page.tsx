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
