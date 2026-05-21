import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteUser } from "@/app/actions/admin";
import CreateUserModal from "@/components/admin/CreateUserModal";
import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminTable from "@/components/admin/AdminTable";

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
    <AdminPageLayout
      title="Users"
      count={users.length}
      itemName="user"
      action={isAdmin ? <CreateUserModal /> : undefined}
    >
      <AdminTable
        isEmpty={users.length === 0}
        emptyMessage="No users found."
        headers={[
          <th>ID</th>,
          <th style={{ width: "100%" }}>Username</th>,
          <th>Role</th>,
          <th>Created</th>,
          <th style={{ width: "80px" }}>Actions</th>,
        ]}
      >
        {users.map((u) => (
          <tr key={u.id}>
            <td className="mono">{u.id}</td>
            <td className="admin-table-primary">{u.username}</td>
            <td>
              <span className="admin-tag">{u.role}</span>
            </td>
            <td className="mono">
              {new Date(u.created_at).toISOString().slice(0, 10)}
            </td>
            <td>
              <DeleteButton
                id={u.id}
                action={deleteUser}
                confirmMessage={`Delete user ${u.username}?`}
                disabled={!isAdmin || u.username === currentUser.name}
              />
            </td>
          </tr>
        ))}
      </AdminTable>
    </AdminPageLayout>
  );
}
