import { uploadPicture } from "./uploadPicture";
import { createItem } from "./createItem";

export const generateUrl = async (xAccount: string, pic: Buffer) => {
  const imageUrl = await uploadPicture(xAccount, pic);
  const itemId = await createItem(imageUrl, xAccount);

  return `${process.env.NEXT_PUBLIC_BASE_URL}/${itemId}`;
};
