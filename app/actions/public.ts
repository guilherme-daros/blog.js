"use server";

import { messageService } from "@/lib/services/messageService";
import { subscriberService } from "@/lib/services/subscriberService";
import { z } from "zod";
import { ActionState } from "./admin";

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export async function submitContactForm(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  try {
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

const NewsletterSchema = z.object({
  email: z.string().email(),
});

export async function subscribeNewsletter(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  try {
    const data = NewsletterSchema.parse({
      email: formData.get("email"),
    });

    await subscriberService.addSubscriber(data.email);

    return { success: true };
  } catch (error: any) {
    // Check for unique constraint violation (already subscribed)
    if (error.code === 'P2002') {
      return { error: "You are already subscribed to our newsletter!" };
    }
    console.error("Newsletter error:", error);
    return { error: error.message || "Failed to subscribe" };
  }
}
