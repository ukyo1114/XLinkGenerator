import { uploadPicture } from "../uploadPicture";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// AWS S3クライアントのモック
jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  PutObjectCommand: jest.fn(),
}));

// 環境変数のモック
const mockEnvVars = {
  AWS_REGION: "us-east-1",
  AWS_ACCESS_KEY_ID: "test-access-key",
  AWS_SECRET_ACCESS_KEY: "test-secret-key",
  S3_BUCKET_NAME: "test-bucket",
};

describe("uploadPicture", () => {
  beforeEach(() => {
    // 環境変数の設定
    process.env = { ...process.env }; // 環境変数のコピーを作成
    process.env.AWS_REGION = mockEnvVars.AWS_REGION;
    process.env.AWS_ACCESS_KEY_ID = mockEnvVars.AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = mockEnvVars.AWS_SECRET_ACCESS_KEY;
    process.env.S3_BUCKET_NAME = mockEnvVars.S3_BUCKET_NAME;

    // モックのリセット
    jest.clearAllMocks();
  });

  afterEach(() => {
    // テスト後に環境変数をリストア
    jest.resetModules();
  });

  it("should throw error when environment variables are not defined", async () => {
    // 環境変数をクリア
    delete process.env.AWS_REGION;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;

    const testBuffer = Buffer.from([
      0xff,
      0xd8,
      0xff,
      0xe0, // JPEG header
      0x00,
      0x10,
      0x4a,
      0x46,
      0x49,
      0x46,
      0x00, // JFIF\0
      0x01,
      0x01,
      0x01,
      0x00,
      0x48,
      0x00,
      0x48,
      0x00,
      0x00, // その他のJPEGデータ
    ]);

    await expect(uploadPicture("test_account", testBuffer)).rejects.toThrow();
  });

  it("should throw error for invalid file type", async () => {
    const invalidBuffer = Buffer.from("invalid image data");

    await expect(
      uploadPicture("test_account", invalidBuffer)
    ).rejects.toThrow();
  });

  it("should upload JPEG image and return URL", async () => {
    const testBuffer = Buffer.from([
      0xff,
      0xd8,
      0xff,
      0xe0, // JPEG header
      0x00,
      0x10,
      0x4a,
      0x46,
      0x49,
      0x46,
      0x00, // JFIF\0
      0x01,
      0x01,
      0x01,
      0x00,
      0x48,
      0x00,
      0x48,
      0x00,
      0x00, // その他のJPEGデータ
    ]);

    const result = await uploadPicture("test_account", testBuffer);

    // S3クライアントの呼び出しを確認
    expect(S3Client).toHaveBeenCalledWith({
      region: mockEnvVars.AWS_REGION,
      credentials: {
        accessKeyId: mockEnvVars.AWS_ACCESS_KEY_ID,
        secretAccessKey: mockEnvVars.AWS_SECRET_ACCESS_KEY,
      },
    });

    // PutObjectCommandの呼び出しを確認
    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: mockEnvVars.S3_BUCKET_NAME,
      Key: "images/test_account_profile.jpg",
      Body: testBuffer,
      ContentType: "image/jpeg",
      CacheControl: "no-cache",
    });

    // 返却されるURLの形式を確認
    expect(result).toBe(
      `https://${mockEnvVars.S3_BUCKET_NAME}.s3.${mockEnvVars.AWS_REGION}.amazonaws.com/images/test_account_profile.jpg`
    );
  });

  it("should upload PNG image and return URL", async () => {
    const testBuffer = Buffer.from([
      0x89,
      0x50,
      0x4e,
      0x47, // PNG header
      0x0d,
      0x0a,
      0x1a,
      0x0a, // PNG header
      0x00,
      0x00,
      0x00,
      0x0d, // IHDR chunk length
      0x49,
      0x48,
      0x44,
      0x52, // IHDR chunk type
      0x00,
      0x00,
      0x00,
      0x01, // width
      0x00,
      0x00,
      0x00,
      0x01, // height
      0x08,
      0x06,
      0x00,
      0x00, // bit depth, color type, compression, filter, interlace
      0x00, // CRC
    ]);

    const result = await uploadPicture("test_account", testBuffer);

    // S3クライアントの呼び出しを確認
    expect(S3Client).toHaveBeenCalledWith({
      region: mockEnvVars.AWS_REGION,
      credentials: {
        accessKeyId: mockEnvVars.AWS_ACCESS_KEY_ID,
        secretAccessKey: mockEnvVars.AWS_SECRET_ACCESS_KEY,
      },
    });

    // PutObjectCommandの呼び出しを確認
    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: mockEnvVars.S3_BUCKET_NAME,
      Key: "images/test_account_profile.png",
      Body: testBuffer,
      ContentType: "image/png",
      CacheControl: "no-cache",
    });

    // 返却されるURLの形式を確認
    expect(result).toBe(
      `https://${mockEnvVars.S3_BUCKET_NAME}.s3.${mockEnvVars.AWS_REGION}.amazonaws.com/images/test_account_profile.png`
    );
  });

  it("should throw error when S3 upload fails", async () => {
    const testBuffer = Buffer.from([
      0xff,
      0xd8,
      0xff,
      0xe0, // JPEG header
      0x00,
      0x10,
      0x4a,
      0x46,
      0x49,
      0x46,
      0x00, // JFIF\0
      0x01,
      0x01,
      0x01,
      0x00,
      0x48,
      0x00,
      0x48,
      0x00,
      0x00, // その他のJPEGデータ
    ]);

    // S3クライアントのモックを失敗するように設定
    (S3Client as jest.Mock).mockImplementationOnce(() => ({
      send: jest.fn().mockRejectedValueOnce(new Error("S3 upload failed")),
    }));

    await expect(uploadPicture("test_account", testBuffer)).rejects.toThrow();
  });
});
