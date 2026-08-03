import React, { ReactNode } from "react";

interface AdminTableProps {
  headers: ReactNode[];
  children: ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export default function AdminTable({
  headers,
  children,
  emptyMessage = "No items found.",
  isEmpty = false,
}: AdminTableProps) {
  if (isEmpty) {
    return (
      <p className="text-muted-foreground font-mono text-xs mt-4">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="border border-border rounded-[var(--radius)] overflow-x-auto">
      <table className="w-full border-collapse text-[13px] [&_thead]:bg-panel [&_th]:font-mono [&_th]:text-xs [&_th]:tracking-[1.2px] [&_th]:uppercase [&_th]:text-muted-foreground [&_th]:p-[10px_14px] [&_th]:text-left [&_th]:font-normal [&_td]:p-[10px_14px] [&_td]:border-t [&_td]:border-border [&_td]:text-foreground [&_td]:text-[13px] [&_td.mono]:font-mono [&_td.mono]:text-xs [&_td.mono]:text-muted-foreground [&_td.mono]:whitespace-nowrap [&_a]:text-white [&_a]:no-underline [&_a]:transition-colors [&_a:hover]:text-primary">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <React.Fragment key={i}>{header}</React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
