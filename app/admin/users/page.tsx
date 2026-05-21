import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteUser } from "@/app/actions/admin";
import CreateUserModal from "@/components/admin/CreateUserModal";

export const metadata: Metadata = {
  title: "Users — Terminal Admin",
};

export default async function AdminUsers() {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user as any;
  const isAdmin = currentUser?.role === "admin";

  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
          <h2 style={{ margin: 0 }}>Users</h2>
          <span className="admin-count" style={{ margin: 0 }}>
            {users.length} user{users.length !== 1 ? "s" : ""}
          </span>
        </div>
        {isAdmin && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <CreateUserModal />
          </div>
        )}
      </div>

      <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th style={{ width: "80px" }}></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>
                      <span className="admin-tag">{u.role}</span>
                    </td>
                    <td className="mono">
                      {new Date(u.created_at).toISOString().slice(0, 10)}
                    </td>
                    <td>
                      {isAdmin && u.username !== currentUser.name && (
                        <DeleteButton
                          id={u.id}
                          action={deleteUser}
                          confirmMessage={`Delete user ${u.username}?`}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    </>
  );
}
