import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteSubscriber } from "@/app/actions/admin";
import SubscribersClient from "@/components/admin/SubscribersClient";

export const metadata: Metadata = {
  title: "Subscribers — Terminal Admin",
};

export default async function AdminSubscribers() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === "admin";

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { id: "desc" },
  });

  return <SubscribersClient subscribers={subscribers} isAdmin={isAdmin} />;
}
