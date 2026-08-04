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
            className="admin-action-btn danger"
          >
            DEL
          </button>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={4} style={{ padding: 0 }}>
            <div style={{ padding: "16px", background: "var(--ide-surface)", borderTop: "1px solid var(--ide-border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                {msg.name} &lt;{msg.email}&gt;
              </div>
              <p style={{ fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                {msg.body}
              </p>
              <a
                href={`mailto:${msg.email}`}
                className="admin-action-btn"
                style={{ marginTop: "1rem", display: "inline-block", textDecoration: "none" }}
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
