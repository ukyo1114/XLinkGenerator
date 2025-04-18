import { fileTypeFromBuffer } from "file-type";
import formidable from "formidable";

export const validateXAccount = (xAccount: string): void => {
  const isXAccountValid = xAccount.length >= 5 && xAccount.length <= 15;
  if (!isXAccountValid) throw new Error();
};

export const validatePicture = async (pic: Buffer): Promise<void> => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const fileType = await fileTypeFromBuffer(pic);
  const isImageValid =
    fileType &&
    ["image/jpeg", "image/png"].includes(fileType.mime) &&
    pic.length < MAX_FILE_SIZE;
  if (!isImageValid) throw new Error();
};

export const validateForm = async (
  field: string[],
  files: formidable.File[]
): Promise<void> => {
  if (!field || field.length === 0) {
    throw new Error("xAccountが提供されていません");
  }

  if (!files || files.length === 0) {
    throw new Error("画像ファイルが提供されていません");
  }

  const pic = imageFiles[0];
  const picPath = pic.filepath;
  const buffer = fs.readFileSync(picPath);
};
