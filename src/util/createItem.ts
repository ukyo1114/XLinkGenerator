import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const createItem = async (
  imageUrl: string,
  xAccount: string
): Promise<string> => {
  const newItem = await prisma.xAccountImage.create({
    data: { imageUrl, xAccount },
  });

  return newItem.id;
};
