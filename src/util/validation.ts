import * as FileType from "file-type";
import formidable from "formidable";
import fs from "fs";

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
  field: string[] | undefined,
  files: formidable.File[] | undefined
): Promise<{ xAccount: string; buffer: Buffer }> => {
  if (!field || field.length === 0) {
    throw new Error("xAccountが提供されていません");
  }

  if (!files || files.length === 0) {
    throw new Error("画像ファイルが提供されていません");
  }

  const xAccount = field[0];
  validateXAccount(xAccount);

  const pic = files[0];
  const picPath = pic.filepath;
  const buffer = fs.readFileSync(picPath);
  await validatePicture(buffer);

  return { xAccount, buffer };
};
