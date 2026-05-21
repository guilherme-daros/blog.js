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
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <span className="admin-count" style={{ margin: 0 }}>
            {count} {itemName}{count !== 1 ? "s" : ""}
          </span>
        </div>
        {action && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {action}
          </div>
        )}
      </div>
      {children}
    </>
  );
}
