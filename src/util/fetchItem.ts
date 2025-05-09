import { PrismaClient } from "@/generated/prisma";
import { FetchItem } from "@/types";

export const fetchItem = async (id: string): Promise<FetchItem | null> => {
  const prisma = new PrismaClient();

  try {
    const data = await prisma.xAccountImage.findUnique({ where: { id } });
    return data ? { imageUrl: data.imageUrl, xAccount: data.xAccount } : null;
  } finally {
    await prisma.$disconnect();
  }
};
