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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2>Social Links</h2>
      </div>

      {isAdmin ? (
        <SocialLinksForm initialLinks={links} />
      ) : (
        <div className="admin-social-list">
          {links.map((link) => (
            <div key={link.id} className="admin-social-card">
              <div className="admin-social-fields">
                <div className="form-group">
                  <label>Platform</label>
                  <span className="admin-readonly">{link.platform}</span>
                </div>
                <div className="form-group">
                  <label>URL</label>
                  <span className="admin-readonly">{link.url}</span>
                </div>
                <div className="form-group">
                  <label>Handle</label>
                  <span className="admin-readonly">{link.handle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
