import { fetchItem } from "../fetchItem";
import { PrismaClient } from "../../generated/prisma";

// Prismaクライアントのモック
jest.mock("../../generated/prisma");

// モックの結果を保持する変数
let mockFindResult: { imageUrl: string; xAccount: string } | null = null;
let mockFindError: Error | null = null;

// モックのPrismaClientインスタンス
const mockPrismaClient = {
  xAccountImage: {
    findUnique: jest.fn(() => {
      if (mockFindError) {
        return Promise.reject(mockFindError);
      }
      return Promise.resolve(mockFindResult);
    }),
  },
  $on: jest.fn(),
  $connect: jest.fn(),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  $use: jest.fn(),
  $transaction: jest.fn(),
  $extends: jest.fn(),
  $queryRaw: jest.fn(),
  $executeRaw: jest.fn(),
  $queryRawUnsafe: jest.fn(),
  $executeRawUnsafe: jest.fn(),
} as unknown as PrismaClient;

// モックの実装を設定
const mockPrismaConstructor = jest.fn(() => mockPrismaClient);
jest.mocked(PrismaClient).mockImplementation(mockPrismaConstructor);

describe("fetchItem", () => {
  beforeEach(() => {
    // モックのリセット
    jest.clearAllMocks();
    mockFindResult = null;
    mockFindError = null;
  });

  it("should return item data when item is found", async () => {
    const mockId = "test-uuid";
    const mockImageUrl = "https://example.com/image.jpg";
    const mockXAccount = "testuser";

    // モックの結果を設定
    mockFindResult = {
      imageUrl: mockImageUrl,
      xAccount: mockXAccount,
    };

    const result = await fetchItem(mockId);

    // findUniqueメソッドが正しい引数で呼び出されたことを確認
    expect(mockPrismaClient.xAccountImage.findUnique).toHaveBeenCalledWith({
      where: { id: mockId },
    });

    // 返却値を確認
    expect(result).toEqual({
      imageUrl: mockImageUrl,
      xAccount: mockXAccount,
    });

    // データベース接続が切断されたことを確認
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });

  it("should return null when item is not found", async () => {
    const mockId = "non-existent-uuid";

    // モックの結果をnullに設定
    mockFindResult = null;

    const result = await fetchItem(mockId);

    // findUniqueメソッドが正しい引数で呼び出されたことを確認
    expect(mockPrismaClient.xAccountImage.findUnique).toHaveBeenCalledWith({
      where: { id: mockId },
    });

    // nullが返却されることを確認
    expect(result).toBeNull();

    // データベース接続が切断されたことを確認
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });

  it("should throw an error when database operation fails", async () => {
    const mockId = "test-uuid";

    // エラーを設定
    mockFindError = new Error("Database error");

    // エラーがスローされ、データベース接続が切断されることを確認
    await expect(fetchItem(mockId)).rejects.toThrow("Database error");
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });

  it("should disconnect from database even when findUnique throws a synchronous error", async () => {
    const mockId = "test-uuid";

    // findUniqueメソッドで同期的なエラーを設定
    mockFindError = new Error("Synchronous error");

    // エラーがスローされ、データベース接続が切断されることを確認
    await expect(fetchItem(mockId)).rejects.toThrow("Synchronous error");
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });
});
