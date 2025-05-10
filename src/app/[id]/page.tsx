import { fetchItem } from "@/util/fetchItem";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const data = await fetchItem(resolvedParams.id);
  if (!data) redirect("/not-found");

  // Xのクロラーかどうかを判定（User-Agentをチェック）
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isCrawler =
    userAgent.toLowerCase().includes("twitterbot") ||
    userAgent.toLowerCase().includes("x.com") ||
    userAgent.toLowerCase().includes("facebookexternalhit");

  // クロラーの場合はメタデータを表示、それ以外はリダイレクト
  if (isCrawler) {
    return (
      <div>
        <h1>Preview Page</h1>
        <p>X Account: {data.xAccount}</p>
        <p>Image URL: {data.imageUrl}</p>
      </div>
    );
  }

  redirect(`https://x.com/${data.xAccount}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await fetchItem(resolvedParams.id);
  if (!data) return {};

  const imageUrl = data.imageUrl;
  console.log("Generated image URL:", imageUrl);
  const title = `${data.xAccount} on X`;
  const description = `Check out ${data.xAccount}'s profile on X`;

  return {
    title,
    description,
    openGraph: {
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
  };
}
