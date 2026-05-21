"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { postService } from "@/lib/services/postService";
import { userService } from "@/lib/services/userService";
import { socialService } from "@/lib/services/socialService";
import { messageService } from "@/lib/services/messageService";
import { subscriberService } from "@/lib/services/subscriberService";
import { z } from "zod";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "admin") throw new Error("Unauthorized");
  return session;
}

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

const PostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string(),
  tag: z.string().min(1),
  read_time: z.coerce.number().int().min(1),
  published_at: z.string(),
  is_featured: z.coerce.boolean(),
});

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function createPost(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  try {
    await checkAdmin();

    const data = PostSchema.parse({
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      tag: formData.get("tag"),
      read_time: formData.get("read_time"),
      published_at: formData.get("published_at"),
      is_featured: formData.get("is_featured") === "1",
    });

    await postService.createPost(data);

    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/admin/posts");
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) throw error;
    console.error("Create post error:", error);
    return { error: error.message || "Failed to create post" };
  }
  redirect("/admin/posts");
}

export async function updatePost(id: number, prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  try {
    await checkAdmin();

    const data = PostSchema.partial().parse({
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      tag: formData.get("tag"),
      read_time: formData.get("read_time"),
      published_at: formData.get("published_at"),
    });

    await postService.updatePost(id, data);

    revalidatePath("/");
    revalidatePath(`/post/${data.slug || ""}`);
    revalidatePath("/archive");
    revalidatePath("/admin/posts");
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) throw error;
    console.error("Update post error:", error);
    return { error: error.message || "Failed to update post" };
  }
  redirect("/admin/posts");
}

export async function deletePost(id: number) {
  await checkAdmin();
  await postService.deletePost(id);

  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath("/admin/posts");
}

export async function featurePost(id: number) {
  await checkAdmin();
  await postService.featurePost(id);

  revalidatePath("/");
  revalidatePath("/admin/posts");
}

export async function markMessageRead(id: number) {
  await checkAuth();
  await messageService.markAsRead(id);
  
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: number) {
  await checkAuth();
  await messageService.deleteMessage(id);
  
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteSubscriber(id: number) {
  await checkAdmin();
  await subscriberService.deleteSubscriber(id);
  
  revalidatePath("/admin/subscribers");
  revalidatePath("/admin");
}

const UserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6).optional(),
  role: z.string(),
});

export async function createUser(formData: FormData) {
  await checkAdmin();

  const data = UserSchema.parse({
    username: formData.get("username"),
    password: formData.get("password") || undefined,
    role: formData.get("role"),
  });

  await userService.createUser(data);

  revalidatePath("/admin/users");
}

export async function deleteUser(id: number) {
  await checkAdmin();
  await userService.deleteUser(id);
  
  revalidatePath("/admin/users");
}

const SocialLinksSchema = z.array(z.object({
  id: z.number().optional(),
  platform: z.string().min(1),
  url: z.string().min(1),
  handle: z.string().optional(),
  sort_order: z.number(),
}));

export async function updateSocialLinks(prevState: ActionState | null, links: any[]): Promise<ActionState> {
  try {
    await checkAdmin();
    const data = SocialLinksSchema.parse(links);
    await socialService.updateSocialLinks(data);

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/admin/social");
    return { success: true };
  } catch (error: any) {
    console.error("Update social links error:", error);
    return { error: error.message || "Failed to update social links" };
  }
}
