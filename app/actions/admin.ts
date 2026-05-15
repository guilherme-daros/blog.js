"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const tag = formData.get("tag") as string;
  const read_time = parseInt(formData.get("read_time") as string) || 5;
  const published_at = formData.get("published_at") as string;
  const is_featured = formData.get("is_featured") === "1" ? 1 : 0;

  if (is_featured === 1) {
    await prisma.post.updateMany({
      where: { is_featured: 1 },
      data: { is_featured: 0 },
    });
  }

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      tag,
      read_time,
      published_at,
      is_featured,
      reads: 0,
      reads_trend: "up",
    },
  });

  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(id: number, formData: FormData) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const tag = formData.get("tag") as string;
  const read_time = parseInt(formData.get("read_time") as string) || 5;
  const published_at = formData.get("published_at") as string;

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      tag,
      read_time,
      published_at,
    },
  });

  revalidatePath("/");
  revalidatePath(`/post/${slug}`);
  revalidatePath("/archive");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(id: number) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

  await prisma.post.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath("/admin/posts");
}

export async function featurePost(id: number) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

  await prisma.post.updateMany({
    where: { is_featured: 1 },
    data: { is_featured: 0 },
  });

  await prisma.post.update({
    where: { id },
    data: { is_featured: 1 },
  });

  revalidatePath("/");
  revalidatePath("/admin/posts");
}

export async function markMessageRead(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.message.update({
    where: { id },
    data: { read: 1 },
  });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteSubscriber(id: number) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

  await prisma.subscriber.delete({ where: { id } });
  revalidatePath("/admin/subscribers");
  revalidatePath("/admin");
}

import bcrypt from "bcryptjs";

export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const password_hash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      password_hash,
      role,
    },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(id: number) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function updateSocialLinks(links: { id?: number, platform: string, url: string, handle: string, sort_order: number }[]) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

  // A simple strategy is to delete all and re-create them with the given sort_order
  await prisma.socialLink.deleteMany();
  
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    await prisma.socialLink.create({
      data: {
        platform: link.platform,
        url: link.url,
        handle: link.handle,
        sort_order: i,
      }
    });
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/social");
}

