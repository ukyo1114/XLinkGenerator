import { fetchItem } from "@/util/fetchItem";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const data = await fetchItem(resolvedParams.id);
  if (!data) redirect("/not-found");

  redirect(`https://x.com/${data.xAccount}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await fetchItem(resolvedParams.id);
  if (!data) return {};

  const imageUrl = data.imageUrl;
  console.log(imageUrl);

  const title = `${data.xAccount} on X`;
  const description = `Check out ${data.xAccount}'s profile on X`;

  return {
    title,
    description,
    other: {
      "twitter:card": "summary",
      "twitter:image": imageUrl,
      "twitter:title": title,
      "twitter:description": description,
      "twitter:creator": data.xAccount,
    },
  };
}
