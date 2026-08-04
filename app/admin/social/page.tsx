import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SocialLinksForm from "@/components/admin/SocialLinksForm";
import AdminPageLayout from "@/components/admin/AdminPageLayout";

export const metadata: Metadata = {
  title: "Social Links — Terminal Admin",
};

export default async function AdminSocialLinks() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === "admin";

  const links = await prisma.socialLink.findMany({
    orderBy: { sort_order: "asc" },
  });

  return (
    <>
      {isAdmin ? (
        <SocialLinksForm initialLinks={links} />
      ) : (
        <AdminPageLayout
          title="Social Links"
          count={links.length}
          itemName="link"
          action={null}
        >
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th style={{ width: "100%" }}>URL</th>
                  <th>Handle</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id}>
                    <td>
                      <strong>{link.platform}</strong>
                    </td>
                    <td>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.url}
                      </a>
                    </td>
                    <td className="mono">{link.handle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminPageLayout>
      )}
    </>
  );
}
