import { PrismaClient } from "../generated/prisma";

export const createItem = async (
  imageUrl: string,
  xAccount: string
): Promise<string> => {
  const prisma = new PrismaClient();

  try {
    const newItem = await prisma.xAccountImage.create({
      data: { imageUrl, xAccount },
    });

    return newItem.id;
  } finally {
    await prisma.$disconnect();
  }
};
