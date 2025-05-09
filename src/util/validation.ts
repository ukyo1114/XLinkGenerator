import * as FileType from "file-type";

export const validateXAccount = (xAccount: string): void => {
  const isXAccountValid = xAccount.length >= 5 && xAccount.length <= 15;
  if (!isXAccountValid) throw new Error("Xアカウントの形式が無効です");
};

export const validatePicture = async (pic: Buffer): Promise<void> => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const fileType = await FileType.fromBuffer(pic);
  const isImageValid =
    fileType &&
    ["image/jpeg", "image/png"].includes(fileType.mime) &&
    pic.length < MAX_FILE_SIZE;
  if (!isImageValid) throw new Error("画像の形式が無効です");
};

export const validateForm = async (
  xAccount: string,
  file: File
): Promise<{ xAccount: string; buffer: Buffer }> => {
  if (!xAccount) {
    throw new Error("xAccountが提供されていません");
  }

  if (!file) {
    throw new Error("画像ファイルが提供されていません");
  }

  validateXAccount(xAccount);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await validatePicture(buffer);

  return { xAccount, buffer };
};
