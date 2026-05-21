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
    <div className={`admin-message-item ${!isRead ? "unread" : ""}`}>
      <div className="admin-message-header" onClick={toggleOpen}>
        <div className="admin-message-from">
          <strong>{msg.subject || "(no subject)"}</strong>
          {!isRead && <span className="unread-dot" style={{marginLeft: "6px"}}></span>}
          <span className="admin-message-name">{msg.name}</span>
        </div>
        <div className="admin-message-meta">
          <span className="mono">
            {new Date(msg.created_at).toISOString().slice(0, 10)}
          </span>
          <button
            onClick={handleDelete}
            className="admin-action-btn danger"
          >
            Del
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="admin-message-detail" style={{ display: "block" }}>
          <div className="admin-message-body">
            <div className="admin-message-sender">
              {msg.name} &lt;{msg.email}&gt;
            </div>
            <p>{msg.body}</p>
            <a
              href={`mailto:${msg.email}`}
              className="admin-action-btn"
              style={{ marginTop: "0.75rem", display: "inline-block", textDecoration: "none" }}
            >
              Reply via email →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
