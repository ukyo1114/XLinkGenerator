import { NextResponse } from "next/server";
import { createItem } from "@/util/createItem";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { imageUrl, xAccount } = body;
  const ItemId = await createItem(imageUrl, xAccount);

  return NextResponse.json({ generatedUrl: ItemId });
};
// エラーハンドリングの追加
