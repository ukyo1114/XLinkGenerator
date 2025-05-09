import { NextResponse } from "next/server";
import { generateUrl } from "@/util/generateUrl";
import { validateForm } from "@/util/validation";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const xAccount = formData.get("xAccount");
    const image = formData.get("image") as File;

    if (!xAccount || !image) {
      return NextResponse.json(
        { error: "xAccount and image are required" },
        { status: 400 }
      );
    }

    const { xAccount: validatedXAccount, buffer } = await validateForm(
      xAccount.toString(),
      image
    );

    const url = await generateUrl(validatedXAccount, buffer);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
