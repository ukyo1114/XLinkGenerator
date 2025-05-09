import { validateXAccount, validatePicture, validateForm } from "../validation";

describe("validation", () => {
  describe("validateXAccount", () => {
    it("should not throw error for valid X account", () => {
      expect(() => validateXAccount("valid_account")).not.toThrow();
      expect(() => validateXAccount("valid123")).not.toThrow();
      expect(() => validateXAccount("valid_123")).not.toThrow();
    });

    it("should throw error for invalid X account length", () => {
      expect(() => validateXAccount("a".repeat(4))).toThrow(
        "Xアカウントの形式が無効です"
      );
      expect(() => validateXAccount("a".repeat(16))).toThrow(
        "Xアカウントの形式が無効です"
      );
    });
  });

  describe("validatePicture", () => {
    it("should throw error for invalid file type", async () => {
      const invalidBuffer = Buffer.from("invalid image data");
      await expect(validatePicture(invalidBuffer)).rejects.toThrow(
        "画像の形式が無効です"
      );
    });

    it("should throw error for file size exceeding limit", async () => {
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
      await expect(validatePicture(largeBuffer)).rejects.toThrow(
        "画像の形式が無効です"
      );
    });
  });

  describe("validateForm", () => {
    it("should throw error when xAccount is not provided", async () => {
      const mockFile = new File([], "test.jpg", { type: "image/jpeg" });
      await expect(validateForm("", mockFile)).rejects.toThrow(
        "xAccountが提供されていません"
      );
    });

    it("should throw error when image file is not provided", async () => {
      await expect(
        validateForm("valid_account", null as unknown as File)
      ).rejects.toThrow("画像ファイルが提供されていません");
    });

    it("should throw error for invalid X account", async () => {
      const mockFile = new File([], "test.jpg", { type: "image/jpeg" });
      await expect(validateForm("shrt", mockFile)).rejects.toThrow(
        "Xアカウントの形式が無効です"
      );
    });

    it("should return xAccount and buffer for valid input", async () => {
      const testImageBuffer = Buffer.from([
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
      const mockFile = new File([testImageBuffer], "test.jpg", {
        type: "image/jpeg",
      });

      const result = await validateForm("valid_account", mockFile);
      expect(result).toHaveProperty("xAccount", "valid_account");
      expect(result).toHaveProperty("buffer");
    });
  });
});
