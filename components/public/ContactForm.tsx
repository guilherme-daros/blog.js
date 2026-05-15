"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate form submission
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  if (status === "success") {
    return (
      <div className="contact-result success">
        Your message has been sent successfully. I will get back to you soon.
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
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
            disabled={status === "loading"}
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
            disabled={status === "loading"}
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
          disabled={status === "loading"}
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
          disabled={status === "loading"}
        ></textarea>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
