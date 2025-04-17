import { PrismaClient } from "@/generated/prisma";
import { FetchItem } from "@/types";

const prisma = new PrismaClient();

export const fetchItem = async (id: string): Promise<FetchItem | null> => {
  const data = await prisma.xAccountImage.findUnique({ where: { id } });
  return data ? { imageUrl: data.imageUrl, xAccount: data.xAccount } : null;
};
