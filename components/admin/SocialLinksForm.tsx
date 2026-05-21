"use client";

import { useState, useActionState, useEffect } from "react";
import { updateSocialLinks, ActionState } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

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

  return (
    <form action={formAction} style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
          <h2 style={{ margin: 0 }}>Social Links</h2>
          <span className="admin-count" style={{ margin: 0 }}>
            {links.length} link{links.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" className="btn btn-outline" onClick={handleAdd} disabled={isPending}>
            Add link
          </button>
          <button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {state?.error && (
        <div className="admin-error-banner" style={{ marginBottom: "1rem", padding: "0.75rem", background: "rgba(220, 38, 38, 0.1)", border: "1px solid var(--error)", color: "var(--error)", borderRadius: "var(--radius)" }}>
          {state.error}
        </div>
      )}
      
      <div className="admin-table-wrap" style={{ marginBottom: "1rem" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>URL</th>
              <th>Handle</th>
              <th style={{ width: "80px" }}></th>
            </tr>
          </thead>
          <tbody>
            {links.map((link, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => handleChange(i, "platform", e.target.value)}
                    placeholder="e.g. Twitter"
                    required
                    disabled={isPending}
                    style={{ width: "100%", background: "transparent", border: "none", color: "inherit", outline: "none", padding: "4px 0" }}
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
                    Del
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
