"use client";

import { useState, useTransition } from "react";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteSubscriber, deleteSubscribers } from "@/app/actions/admin";

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

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
          <h2 style={{ margin: 0 }}>Subscribers</h2>
          <span className="admin-count" style={{ margin: 0 }}>
            {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {isManaging ? (
            <>
              <button
                className="btn btn-outline"
                style={{ borderColor: "var(--error)", color: "var(--error)" }}
                onClick={handleDeleteSelected}
                disabled={selectedIds.size === 0 || isPending}
              >
                {isPending ? "Deleting..." : `Delete Selected (${selectedIds.size})`}
              </button>
              <button className="btn btn-outline" onClick={() => { setIsManaging(false); setSelectedIds(new Set()); }} disabled={isPending}>
                Done
              </button>
            </>
          ) : (
            <button
              className="btn btn-outline"
              onClick={() => setIsManaging(true)}
              disabled={subscribers.length === 0 || !isAdmin}
            >
              Manage
            </button>
          )}
        </div>
      </div>
      {subscribers.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {isManaging && (
                  <th style={{ width: "40px" }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.size === subscribers.length && subscribers.length > 0}
                      onChange={handleSelectAll}
                      disabled={isPending}
                    />
                  </th>
                )}
                <th>Email</th>
                <th>Subscribed</th>
                {isAdmin && !isManaging && <th style={{ width: "80px" }}></th>}
              </tr>
            </thead>
            <tbody>
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
                  <td className="mono">{sub.email}</td>
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
            </tbody>
          </table>
        </div>
      ) : (
        <p className="admin-empty">No subscribers yet.</p>
      )}
    </>
  );
}
