"use client";

import { useState } from "react";
import { createUser } from "@/app/actions/admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleOpen}>
          + New User
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-[var(--radius)] text-sm">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <Input
            type="text"
            id="username"
            name="username"
            label="Username"
            placeholder="username"
            required
            disabled={isSubmitting}
          />

          <Input
            type="password"
            id="password"
            name="password"
            label="Password"
            placeholder="password"
            required
            disabled={isSubmitting}
          />

          <div>
            <label
              className="block font-mono text-[11px] uppercase tracking-[1px] text-muted-foreground mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              className="w-full bg-background border border-border rounded-[var(--radius)] px-4 h-10 font-mono text-sm tracking-[-0.017em] text-foreground focus:border-primary outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <option value="viewer">Viewer (read-only)</option>
              <option value="admin">Admin (full access)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create user"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
