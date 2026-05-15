"use client";

import { useState } from "react";
import { updateSocialLinks } from "@/app/actions/admin";
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
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSocialLinks(links);
    setIsSaving(false);
    router.refresh();
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
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
                />
              </div>
              <div className="form-group">
                <label>Handle</label>
                <input
                  type="text"
                  value={link.handle}
                  onChange={(e) => handleChange(i, "handle", e.target.value)}
                  placeholder="e.g. @terminal"
                />
              </div>
            </div>
            <button
              type="button"
              className="admin-action-btn danger admin-social-del"
              onClick={() => handleRemove(i)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-outline" onClick={handleAdd}>
          Add link
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
