"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/app/actions/public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, {
    success: false,
    error: undefined,
  });

  if (state?.success) {
    return (
      <Alert variant="success">
        Your message has been sent successfully. I will get back to you soon.
      </Alert>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <Alert variant="destructive">
          {state.error}
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          id="name"
          name="name"
          label="Name"
          placeholder="Your name"
          required
          disabled={isPending}
          className="w-full md:w-[320px]"
        />
        <Input
          type="email"
          id="email"
          name="email"
          label="Email"
          placeholder="you@example.com"
          required
          disabled={isPending}
          className="w-full md:w-[320px]"
        />
      </div>

      <Input
        type="text"
        id="subject"
        name="subject"
        label="Subject"
        placeholder="What's this about?"
        disabled={isPending}
        className="w-full md:w-[320px]"
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">
          Message <span className="text-primary">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Your message..."
          required
          disabled={isPending}
          className="w-full max-w-[656px]"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
