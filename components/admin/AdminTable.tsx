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
    return <p className="admin-empty">{emptyMessage}</p>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
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
