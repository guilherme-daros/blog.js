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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";

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
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
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
            <Label htmlFor="role">Role</Label>
            <Select
              id="role"
              name="role"
              disabled={isSubmitting}
            >
              <option value="viewer">Viewer (read-only)</option>
              <option value="admin">Admin (full access)</option>
            </Select>
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
