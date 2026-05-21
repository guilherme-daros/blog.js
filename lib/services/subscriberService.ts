import prisma from "@/lib/prisma";

export const subscriberService = {
  async getAllSubscribers() {
    return prisma.subscriber.findMany({
      orderBy: { subscribed_at: "desc" },
    });
  },

  async deleteSubscriber(id: number) {
    return prisma.subscriber.delete({
      where: { id },
    });
  },

  async deleteManySubscribers(ids: number[]) {
    return prisma.subscriber.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  },

  async addSubscriber(email: string) {
    return prisma.subscriber.create({
      data: { email },
    });
  }
};
