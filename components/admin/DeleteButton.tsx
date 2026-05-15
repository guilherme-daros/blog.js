"use client";

import { useTransition } from "react";

export default function DeleteButton({
  id,
  action,
  confirmMessage = "Are you sure?",
}: {
  id: number;
  action: (id: number) => Promise<void>;
  confirmMessage?: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(confirmMessage)) {
      startTransition(async () => {
        await action(id);
      });
    }
  };

  return (
    <button
      className="admin-action-btn danger"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "..." : "Del"}
    </button>
  );
}
