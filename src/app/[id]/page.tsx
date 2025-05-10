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

  return {
    title: `${data.xAccount} on X`,
    description: `Check out ${data.xAccount}'s profile on X`,
    openGraph: {
      title: `${data.xAccount} on X`,
      description: `Check out ${data.xAccount}'s profile on X`,
      images: [
        {
          url: data.imageUrl,
          width: 1200,
          height: 630,
          alt: `${data.xAccount}'s profile image`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.xAccount} on X`,
      description: `Check out ${data.xAccount}'s profile on X`,
      images: [data.imageUrl],
    },
  };
}
