import prisma from "@/lib/prisma";

export const postService = {
  async getAllPosts() {
    return prisma.post.findMany({
      orderBy: { published_at: "desc" },
    });
  },

  async getPostById(id: number) {
    return prisma.post.findUnique({
      where: { id },
    });
  },

  async getPostBySlug(slug: string) {
    return prisma.post.findUnique({
      where: { slug },
    });
  },

  async createPost(data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tag: string;
    read_time: number;
    published_at: string | Date;
    is_featured: boolean;
  }) {
    if (data.is_featured) {
      await this.setAllPostsNotFeatured();
    }

    return prisma.post.create({
      data: {
        ...data,
        published_at: new Date(data.published_at),
        is_featured: data.is_featured,
        reads: 0,
        reads_trend: "up",
      },
    });
  },

  async updatePost(id: number, data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    tag?: string;
    read_time?: number;
    published_at?: string | Date;
    is_featured?: boolean;
  }) {
    if (data.is_featured) {
      await this.setAllPostsNotFeatured();
    }

    const updateData: any = { ...data };
    if (data.published_at) {
      updateData.published_at = new Date(data.published_at);
    }

    return prisma.post.update({
      where: { id },
      data: updateData,
    });
  },

  async deletePost(id: number) {
    return prisma.post.delete({
      where: { id },
    });
  },

  async featurePost(id: number) {
    await this.setAllPostsNotFeatured();
    return prisma.post.update({
      where: { id },
      data: { is_featured: true },
    });
  },

  async setAllPostsNotFeatured() {
    return prisma.post.updateMany({
      where: { is_featured: true },
      data: { is_featured: false },
    });
  },
};
