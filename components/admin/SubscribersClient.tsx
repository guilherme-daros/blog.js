"use client";

import { useState, useTransition } from "react";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteSubscriber, deleteSubscribers } from "@/app/actions/admin";

import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminTable from "@/components/admin/AdminTable";

type Subscriber = {
  id: number;
  email: string;
  subscribed_at: Date;
};

export default function SubscribersClient({
  subscribers,
  isAdmin,
}: {
  subscribers: Subscriber[];
  isAdmin: boolean;
}) {
  const [isManaging, setIsManaging] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isPending, startTransition] = useTransition();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(subscribers.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: number, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected subscriber(s)?`)) return;

    startTransition(async () => {
      await deleteSubscribers(Array.from(selectedIds));
      setSelectedIds(new Set());
      setIsManaging(false);
    });
  };

  const actionButtons = isManaging ? (
    <>
      <button
        className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-destructive text-destructive bg-transparent rounded-[var(--radius)] transition-colors duration-150 hover:bg-destructive/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleDeleteSelected}
        disabled={selectedIds.size === 0 || isPending}
      >
        {isPending ? "Deleting..." : `Delete Selected (${selectedIds.size})`}
      </button>
      <button
        className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-border text-foreground bg-transparent rounded-[var(--radius)] transition-colors duration-150 hover:border-primary hover:text-primary hover:bg-panel cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => { setIsManaging(false); setSelectedIds(new Set()); }}
        disabled={isPending}
      >
        Done
      </button>
    </>
  ) : (
    <button
      className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-border text-foreground bg-transparent rounded-[var(--radius)] transition-colors duration-150 hover:border-primary hover:text-primary hover:bg-panel cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => setIsManaging(true)}
      disabled={subscribers.length === 0 || !isAdmin}
    >
      Manage
    </button>
  );

  const headers = [
    ...(isManaging ? [
      <th style={{ width: "40px" }} key="chk">
        <input
          type="checkbox"
          checked={selectedIds.size === subscribers.length && subscribers.length > 0}
          onChange={handleSelectAll}
          disabled={isPending}
        />
      </th>
    ] : []),
    <th key="id">ID</th>,
    <th style={{ width: "100%" }} key="email">Email</th>,
    <th key="sub">Subscribed</th>,
    ...(isAdmin && !isManaging ? [<th style={{ width: "80px" }} key="acts">Actions</th>] : [])
  ];

  return (
    <AdminPageLayout
      title="Subscribers"
      count={subscribers.length}
      itemName="subscriber"
      action={actionButtons}
    >
      <AdminTable
        isEmpty={subscribers.length === 0}
        emptyMessage="No subscribers yet."
        headers={headers}
      >
        {subscribers.map((sub) => (
          <tr key={sub.id}>
            {isManaging && (
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.has(sub.id)}
                  onChange={(e) => handleSelect(sub.id, e.target.checked)}
                  disabled={isPending}
                />
              </td>
            )}
            <td className="mono">{sub.id}</td>
            <td className="mono admin-table-primary">{sub.email}</td>
            <td className="mono">
              {new Date(sub.subscribed_at).toISOString().slice(0, 10)}
            </td>
            {isAdmin && !isManaging && (
              <td>
                <DeleteButton
                  id={sub.id}
                  action={deleteSubscriber}
                  confirmMessage="Remove this subscriber?"
                />
              </td>
            )}
          </tr>
        ))}
      </AdminTable>
    </AdminPageLayout>
  );
}
