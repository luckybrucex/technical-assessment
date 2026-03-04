import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient();

export function setPrisma(client: PrismaClient) {
  prisma = client;
}

export function getPrisma(): PrismaClient {
  return prisma;
}
