"use client";

import React, { ReactNode, useEffect } from "react";
import { useAdminHeader } from "@/lib/contexts/AdminHeaderContext";

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
  const { setHeaderData, isRealProvider } = useAdminHeader();

  useEffect(() => {
    if (isRealProvider) {
      setHeaderData({
        title: (
          <>
            <span>{title}</span>
            {itemName && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-panel border border-border text-muted-foreground">
                {count} {itemName}
                {count !== 1 ? "s" : ""}
              </span>
            )}
          </>
        ),
        actions: action || null,
      });

      return () => {
        setHeaderData({
          title: "Dashboard",
          actions: null,
        });
      };
    }
  }, [title, count, itemName, action, setHeaderData, isRealProvider]);

  return (
    <div className="space-y-6">
      {!isRealProvider && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white m-0">
              {title}
            </h2>
            {itemName && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-panel border border-border text-muted-foreground">
                {count} {itemName}
                {count !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {action && (
            <div className="flex items-center gap-2">
              {action}
            </div>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
