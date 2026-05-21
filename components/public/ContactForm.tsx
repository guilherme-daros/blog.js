"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/app/actions/public";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, {
    success: false,
    error: undefined,
  });

  if (state?.success) {
    return (
      <div className="contact-result success">
        Your message has been sent successfully. I will get back to you soon.
      </div>
    );
  }

  return (
    <form className="contact-form" action={formAction}>
      {state?.error && (
        <div className="contact-error" style={{ marginBottom: "1rem", color: "var(--error)" }}>
          {state.error}
        </div>
      )}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            required
            disabled={isPending}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            disabled={isPending}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          placeholder="What's this about?"
          disabled={isPending}
        />
      </div>
      <div className="form-group">
        <label htmlFor="message">
          Message <span className="required">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Your message..."
          required
          disabled={isPending}
        ></textarea>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
