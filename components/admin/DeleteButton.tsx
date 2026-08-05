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
      className="font-mono text-[11px] bg-transparent text-destructive border border-destructive rounded-[var(--radius)] px-[10px] py-1 cursor-pointer transition-colors duration-150 hover:bg-destructive/10 disabled:text-muted-foreground disabled:border-border disabled:bg-transparent disabled:cursor-not-allowed"
      onClick={handleDelete}
      disabled={disabled || isPending}
    >
      {isPending ? "..." : "DEL"}
    </button>
  );
}
