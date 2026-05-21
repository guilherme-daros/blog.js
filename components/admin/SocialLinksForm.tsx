"use client";

import { useState, useActionState, useEffect } from "react";
import { updateSocialLinks, ActionState } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminTable from "@/components/admin/AdminTable";

type SocialLinkInput = {
  id?: number;
  platform: string;
  url: string;
  handle: string;
  sort_order: number;
};

export default function SocialLinksForm({
  initialLinks,
}: {
  initialLinks: any[];
}) {
  const [links, setLinks] = useState<SocialLinkInput[]>(
    initialLinks.map((link, i) => ({ ...link, sort_order: i }))
  );
  
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState | null) => {
      return updateSocialLinks(prevState, links);
    },
    { error: undefined, success: false }
  );

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state?.success, router]);

  const handleAdd = () => {
    setLinks([
      ...links,
      { platform: "", url: "", handle: "", sort_order: links.length },
    ]);
  };

  const handleRemove = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof SocialLinkInput,
    value: string
  ) => {
    const updated = [...links];
    (updated[index] as any)[field] = value;
    setLinks(updated);
  };

  const actionButtons = (
    <>
      <button type="button" className="btn btn-outline" onClick={handleAdd} disabled={isPending}>
        Add link
      </button>
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </button>
    </>
  );

  return (
    <form action={formAction} style={{ width: "100%" }}>
      <AdminPageLayout
        title="Social Links"
        count={links.length}
        itemName="link"
        action={actionButtons}
      >
        {state?.error && (
          <div className="admin-error-banner" style={{ marginBottom: "1rem", padding: "0.75rem", background: "rgba(220, 38, 38, 0.1)", border: "1px solid var(--error)", color: "var(--error)", borderRadius: "var(--radius)" }}>
            {state.error}
          </div>
        )}
        
        <div style={{ marginBottom: "1rem" }}>
          <AdminTable
            headers={[
              <th key="id">ID</th>,
              <th key="platform">Platform</th>,
              <th key="url">URL</th>,
              <th key="handle">Handle</th>,
              <th style={{ width: "80px" }} key="acts">Actions</th>
            ]}
          >
            {links.map((link, i) => (
              <tr key={i}>
                <td className="mono">{link.id ? link.id : "-"}</td>
                <td>
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => handleChange(i, "platform", e.target.value)}
                    placeholder="e.g. Twitter"
                    required
                    disabled={isPending}
                    style={{ width: "100%", background: "transparent", border: "none", color: "inherit", outline: "none", padding: "4px 0" }}
                    className="admin-table-primary"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleChange(i, "url", e.target.value)}
                    placeholder="e.g. https://x.com"
                    required
                    disabled={isPending}
                    style={{ width: "100%", background: "transparent", border: "none", color: "inherit", outline: "none", padding: "4px 0" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={link.handle}
                    onChange={(e) => handleChange(i, "handle", e.target.value)}
                    placeholder="e.g. @terminal"
                    disabled={isPending}
                    style={{ width: "100%", background: "transparent", border: "none", color: "inherit", outline: "none", padding: "4px 0" }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-action-btn danger"
                    onClick={() => handleRemove(i)}
                    disabled={isPending}
                  >
                    DEL
                  </button>
                </td>
              </tr>
            ))}
          </AdminTable>
        </div>
      </AdminPageLayout>
    </form>
  );
}
