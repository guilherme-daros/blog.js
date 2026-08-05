"use server";

import { messageService } from "@/lib/services/messageService";
import { subscriberService } from "@/lib/services/subscriberService";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";
import { z } from "zod";
import { ActionState } from "@/types";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

const NewsletterSchema = z.object({
  email: z.string().email(),
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function submitContactForm(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const ip = await getClientIp();
    // 5 submissions per 10 minutes per IP
    if (isRateLimited(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 })) {
      return { error: "Too many requests. Please wait a few minutes and try again." };
    }

    const data = ContactSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject") || undefined,
      message: formData.get("message"),
    });

    await messageService.createMessage({
      name: data.name,
      email: data.email,
      subject: data.subject || "",
      message: data.message,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Contact form error:", error);
    return { error: error.message || "Failed to send message" };
  }
}

export async function subscribeNewsletter(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const ip = await getClientIp();
    // 3 subscriptions per 10 minutes per IP
    if (isRateLimited(`newsletter:${ip}`, { limit: 3, windowMs: 10 * 60 * 1000 })) {
      return { error: "Too many requests. Please wait a few minutes and try again." };
    }

    const data = NewsletterSchema.parse({
      email: formData.get("email"),
    });

    await subscriberService.addSubscriber(data.email);

    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "You are already subscribed to our newsletter!" };
    }
    console.error("Newsletter error:", error);
    return { error: error.message || "Failed to subscribe" };
  }
}
