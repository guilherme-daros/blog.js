"use client";

import { useState } from "react";
import { markMessageRead, deleteMessage } from "@/app/actions/admin";

export default function MessageItem({ msg }: { msg: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRead, setIsRead] = useState(msg.read);
  const [isDeleted, setIsDeleted] = useState(false);

  const toggleOpen = async () => {
    if (!isOpen && !isRead) {
      setIsRead(true);
      await markMessageRead(msg.id);
    }
    setIsOpen(!isOpen);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this message?")) {
      await deleteMessage(msg.id);
      setIsDeleted(true);
    }
  };

  if (isDeleted) return null;

  return (
    <>
      <tr 
        onClick={toggleOpen} 
        style={{ cursor: "pointer", background: !isRead ? "var(--ide-surface)" : "transparent" }} 
      >
        <td className="mono">{msg.id}</td>
        <td className="admin-table-primary">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: !isRead ? "var(--heading-color)" : "inherit" }}>
              {msg.subject || "(no subject)"}
            </span>
            {!isRead && <span className="unread-dot"></span>}
            <span style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: "normal" }}>
              {msg.name}
            </span>
          </div>
        </td>
        <td className="mono">
          {new Date(msg.created_at).toISOString().slice(0, 10)}
        </td>
        <td>
          <button
            onClick={handleDelete}
            className="font-mono text-[11px] bg-transparent text-destructive border border-destructive rounded-[var(--radius)] px-[10px] py-1 cursor-pointer transition-colors duration-150 hover:bg-destructive/10"
          >
            DEL
          </button>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={4} className="p-0">
            <div className="p-4 bg-[var(--ide-surface)] border-t border-border">
              <div className="font-mono text-xs text-muted-foreground mb-3">
                {msg.name} &lt;{msg.email}&gt;
              </div>
              <p className="text-sm leading-relaxed m-0 text-foreground">
                {msg.body}
              </p>
              <a
                href={`mailto:${msg.email}`}
                className="font-mono text-[11px] text-muted-foreground bg-transparent border border-border rounded-[var(--radius)] px-[10px] py-1 cursor-pointer no-underline transition-colors duration-150 hover:text-[var(--heading-color)] hover:border-[#444] mt-4 inline-block"
              >
                Reply via email →
              </a>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
