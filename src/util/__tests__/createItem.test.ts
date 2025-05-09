import { createItem } from "../createItem";

interface MockCreateResult {
  id: string;
  imageUrl: string;
  xAccount: string;
  createdAt: Date;
}

// モックの結果を保持する変数
let mockCreateResult: MockCreateResult | null = null;
let mockCreateError: Error | null = null;

// モックのPrismaClientインスタンス
const mockPrismaClient = {
  xAccountImage: {
    create: jest.fn(() => {
      if (mockCreateError) {
        return Promise.reject(mockCreateError);
      }
      return Promise.resolve(mockCreateResult);
    }),
  },
  $disconnect: jest.fn().mockResolvedValue(undefined),
};

// Prismaクライアントのモック
jest.mock("../../generated/prisma", () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

describe("createItem", () => {
  beforeEach(() => {
    // モックのリセット
    jest.clearAllMocks();
    mockCreateResult = null;
    mockCreateError = null;
  });

  it("should create a new item and return its ID", async () => {
    const mockImageUrl = "https://example.com/image.jpg";
    const mockXAccount = "testuser";
    const mockId = "test-uuid";

    // モックの結果を設定
    mockCreateResult = {
      id: mockId,
      imageUrl: mockImageUrl,
      xAccount: mockXAccount,
      createdAt: new Date(),
    };

    const result = await createItem(mockImageUrl, mockXAccount);

    // createメソッドが正しい引数で呼び出されたことを確認
    expect(mockPrismaClient.xAccountImage.create).toHaveBeenCalledWith({
      data: {
        imageUrl: mockImageUrl,
        xAccount: mockXAccount,
      },
    });

    // 返却値を確認
    expect(result).toBe(mockId);

    // データベース接続が切断されたことを確認
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });

  it("should throw an error when database operation fails", async () => {
    const mockImageUrl = "https://example.com/image.jpg";
    const mockXAccount = "testuser";

    // エラーを設定
    mockCreateError = new Error("Database error");

    // エラーがスローされることを確認
    await expect(createItem(mockImageUrl, mockXAccount)).rejects.toThrow();

    // データベース接続が切断されたことを確認
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });
});
