import React, { ReactNode } from "react";

interface AdminPageLayoutProps {
  title: string;
  count: number;
  itemName: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function AdminPageLayout({
  title,
  count,
  itemName,
  action,
  children,
}: AdminPageLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-white m-0">
            {title}
          </h2>
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-panel border border-border text-muted-foreground">
            {count} {itemName}
            {count !== 1 ? "s" : ""}
          </span>
        </div>
        {action && (
          <div className="flex items-center gap-2">
            {action}
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
