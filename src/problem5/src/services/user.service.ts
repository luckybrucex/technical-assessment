import { User } from "@prisma/client";
import { userRepository } from "../repositories/user.repository";

export const userService = {
  async create(name: string, email: string): Promise<User> {
    return userRepository.create({ name, email });
  },

  async findAll(filters: { name?: string; email?: string }): Promise<User[]> {
    return userRepository.findAll(filters);
  },

  async findById(id: number): Promise<User | null> {
    return userRepository.findById(id);
  },

  async update(id: number, data: { name?: string; email?: string }): Promise<User> {
    return userRepository.update(id, data);
  },

  async delete(id: number): Promise<User> {
    return userRepository.delete(id);
  },
};
