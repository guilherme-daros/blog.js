import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const userService = {
  async getAllUsers() {
    return prisma.user.findMany();
  },

  async createUser(data: {
    username: string;
    password?: string;
    role: string;
  }) {
    let password_hash = "";
    if (data.password) {
      password_hash = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.create({
      data: {
        username: data.username,
        password_hash,
        role: data.role,
      },
    });
  },

  async deleteUser(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  },
};
