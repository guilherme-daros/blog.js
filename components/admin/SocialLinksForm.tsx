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
    <form className="admin-form" action={formAction}>
      {state?.error && (
        <div className="admin-error-banner" style={{ marginBottom: "1rem", padding: "0.75rem", background: "rgba(220, 38, 38, 0.1)", border: "1px solid var(--error)", color: "var(--error)", borderRadius: "var(--radius)" }}>
          {state.error}
        </div>
      )}
      
      <div className="admin-social-list">
        {links.map((link, i) => (
          <div key={i} className="admin-social-card">
            <div className="admin-social-fields">
              <div className="form-group">
                <label>Platform</label>
                <input
                  type="text"
                  value={link.platform}
                  onChange={(e) => handleChange(i, "platform", e.target.value)}
                  placeholder="e.g. Twitter"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="form-group">
                <label>URL</label>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleChange(i, "url", e.target.value)}
                  placeholder="e.g. https://x.com"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="form-group">
                <label>Handle</label>
                <input
                  type="text"
                  value={link.handle}
                  onChange={(e) => handleChange(i, "handle", e.target.value)}
                  placeholder="e.g. @terminal"
                  disabled={isPending}
                />
              </div>
            </div>
            <button
              type="button"
              className="admin-action-btn danger admin-social-del"
              onClick={() => handleRemove(i)}
              disabled={isPending}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-outline" onClick={handleAdd} disabled={isPending}>
          Add link
        </button>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
