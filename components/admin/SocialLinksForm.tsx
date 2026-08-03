"use client";

import { useState, useActionState, useEffect } from "react";
import { updateSocialLinks } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
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
    async (prevState: any) => {
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
    <div className="flex gap-2">
      <Button type="button" variant="outline" onClick={handleAdd} disabled={isPending}>
        Add link
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );

  const inputClass =
    "w-full bg-transparent border-none text-inherit outline-none py-1 focus:outline-none";

  return (
    <form action={formAction} className="w-full">
      <AdminPageLayout
        title="Social Links"
        count={links.length}
        itemName="link"
        action={actionButtons}
      >
        {state?.error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-[var(--radius)] text-sm">
            {state.error}
          </div>
        )}

        <div className="mb-4">
          <AdminTable
            headers={[
              <th key="id">ID</th>,
              <th key="platform">Platform</th>,
              <th key="url">URL</th>,
              <th key="handle">Handle</th>,
              <th style={{ width: "80px" }} key="acts">Actions</th>,
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
                    className={inputClass}
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
                    className={inputClass}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={link.handle}
                    onChange={(e) => handleChange(i, "handle", e.target.value)}
                    placeholder="e.g. @terminal"
                    disabled={isPending}
                    className={inputClass}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="font-mono text-[11px] bg-transparent text-destructive border border-destructive rounded-[var(--radius)] px-[10px] py-1 cursor-pointer transition-colors duration-150 hover:bg-destructive/10 disabled:text-muted-foreground disabled:border-border disabled:bg-transparent disabled:cursor-not-allowed"
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
