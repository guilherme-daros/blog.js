import prisma from "@/lib/prisma";

export const messageService = {
  async getAllMessages() {
    return prisma.message.findMany({
      orderBy: { created_at: "desc" },
    });
  },

  async markAsRead(id: number) {
    return prisma.message.update({
      where: { id },
      data: { read: true },
    });
  },

  async deleteMessage(id: number) {
    return prisma.message.delete({
      where: { id },
    });
  },

  async createMessage(data: { name: string, email: string, subject: string, message: string }) {
    return prisma.message.create({
      data: {
        body: data.message,
        name: data.name,
        email: data.email,
        subject: data.subject,
        read: false,
      },
    });
  }
};
