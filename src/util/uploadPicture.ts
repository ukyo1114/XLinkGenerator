import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
interface IUploadPicture {
  xAccount: string;
  pic: string;
}
import { errors } from "@/config/errorMessages";

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const isEnvVarsDevined = region && accessKeyId && secretAccessKey;
if (!isEnvVarsDevined) throw new Error(errors.ENV_VARS_NOT_DEFINED);

const s3 = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

export const uploadPicture = async ({
  xAccount,
  pic,
}: IUploadPicture): Promise<string> => {
  const filePath = `user-icons/${xAccount}_profile.jpeg`;
  const base64Data = pic.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filePath,
    Body: buffer,
    ContentType: "image/jpeg",
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
