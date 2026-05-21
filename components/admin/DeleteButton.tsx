"use client";

import { useTransition } from "react";

export default function DeleteButton({
  id,
  action,
  confirmMessage = "Are you sure?",
  disabled = false,
}: {
  id: number;
  action: (id: number) => Promise<void>;
  confirmMessage?: string;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (disabled) return;
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
      disabled={disabled || isPending}
    >
      {isPending ? "..." : "DEL"}
    </button>
  );
}
