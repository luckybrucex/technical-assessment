import { Prisma, User } from "@prisma/client";
import { getPrisma } from "../lib/prisma";

export const userRepository = {
  create(data: Prisma.UserCreateInput): Promise<User> {
    return getPrisma().user.create({ data });
  },

  findAll(filters: { name?: string; email?: string }): Promise<User[]> {
    const where: Prisma.UserWhereInput = {};
    if (filters.name) where.name = { contains: filters.name, mode: "insensitive" };
    if (filters.email) where.email = { contains: filters.email, mode: "insensitive" };
    return getPrisma().user.findMany({ where, orderBy: { createdAt: "desc" } });
  },

  findById(id: number): Promise<User | null> {
    return getPrisma().user.findUnique({ where: { id } });
  },

  update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return getPrisma().user.update({ where: { id }, data });
  },

  delete(id: number): Promise<User> {
    return getPrisma().user.delete({ where: { id } });
  },
};
