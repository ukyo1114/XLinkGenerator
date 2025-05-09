import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as FileType from "file-type";
import { errors } from "@/config/errorMessages";

export const uploadPicture = async (
  xAccount: string,
  pic: Buffer
): Promise<string> => {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const isEnvVarsDevined = region && accessKeyId && secretAccessKey;
  if (!isEnvVarsDevined) throw new Error(errors.ENV_VARS_NOT_DEFINED);

  const s3 = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  const fileType = await FileType.fromBuffer(pic);
  if (!fileType || !["image/jpeg", "image/png"].includes(fileType.mime)) {
    throw new Error();
  }

  const filePath = `images/${xAccount}_profile.${fileType.ext}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filePath,
    Body: pic,
    ContentType: fileType.mime,
    CacheControl: "no-cache",
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error();
  }
};
