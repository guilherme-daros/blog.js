import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteSubscriber } from "@/app/actions/admin";

export const metadata: Metadata = {
  title: "Subscribers — Terminal Admin",
};

export default async function AdminSubscribers() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === "admin";

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2>Subscribers</h2>
      </div>

      <p className="admin-count">
        {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
      </p>

      {subscribers.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
                {isAdmin && <th style={{ width: "80px" }}></th>}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td className="mono">{sub.email}</td>
                  <td className="mono">
                    {new Date(sub.subscribed_at).toISOString().slice(0, 10)}
                  </td>
                  {isAdmin && (
                    <td>
                      <DeleteButton
                        id={sub.id}
                        action={deleteSubscriber}
                        confirmMessage="Remove this subscriber?"
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="admin-empty">No subscribers yet.</p>
      )}
    </>
  );
}
