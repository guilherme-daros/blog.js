import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SocialLinksForm from "@/components/admin/SocialLinksForm";

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
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
              <h2 style={{ margin: 0 }}>Social Links</h2>
              <span className="admin-count" style={{ margin: 0 }}>
                {links.length} link{links.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
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
                  <td><strong>{link.platform}</strong></td>
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
        </>
      )}
    </>
  );
}
