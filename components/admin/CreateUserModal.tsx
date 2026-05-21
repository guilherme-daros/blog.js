"use client";

import { useState } from "react";
import { createUser } from "@/app/actions/admin";

export default function CreateUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      setError(null);
      await createUser(formData);
      setIsOpen(false);
    } catch (e: any) {
      console.error(e);
      let errMsg = e.message || "Failed to create user. Please check the inputs or if the username is taken.";
      try {
        const parsed = JSON.parse(errMsg);
        if (Array.isArray(parsed) && parsed[0]?.message) {
          errMsg = parsed.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(", ");
        }
      } catch (parseError) {
        // Not a JSON string, use original
      }
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpen = () => {
    setError(null);
    setIsOpen(true);
  };

  return (
    <>
      <button className="btn btn-primary" onClick={handleOpen}>
        + New User
      </button>

      {isOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "var(--ide-bg)",
            border: "1px solid var(--ide-border)",
            borderRadius: "var(--radius)",
            padding: "2rem",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
          }}>
            <h2 className="admin-section-title" style={{ marginTop: 0 }}>Create User</h2>
            {error && (
              <div className="admin-error-banner" style={{ marginBottom: "1rem", padding: "0.75rem", background: "rgba(220, 38, 38, 0.1)", border: "1px solid var(--error)", color: "var(--error)", borderRadius: "var(--radius)" }}>
                {error}
              </div>
            )}
            <form action={handleSubmit} className="admin-form" style={{ padding: 0, border: "none", background: "transparent", maxWidth: "100%" }}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" placeholder="username" required disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="password" required disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select id="role" name="role" className="admin-select" disabled={isSubmitting}>
                  <option value="viewer">Viewer (read-only)</option>
                  <option value="admin">Admin (full access)</option>
                </select>
              </div>
              <div className="admin-form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create user"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
