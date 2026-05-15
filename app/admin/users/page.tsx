import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteUser, createUser } from "@/app/actions/admin";

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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2>Users</h2>
      </div>

      <div className="admin-grid-2">
        <section>
          <h2 className="admin-section-title">All Users</h2>
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
        </section>

        {isAdmin && (
          <section>
            <h2 className="admin-section-title">Create User</h2>
            <form action={createUser} className="admin-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select id="role" name="role" className="admin-select">
                  <option value="viewer">Viewer (read-only)</option>
                  <option value="admin">Admin (full access)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Create user
              </button>
            </form>
          </section>
        )}
      </div>
    </>
  );
}
