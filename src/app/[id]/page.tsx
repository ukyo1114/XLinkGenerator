import { fetchItem } from "@/util/fetchItem";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function RedirectPage({ params }: Props) {
  const data = await fetchItem(params.id);
  if (!data) redirect("/not-found");

  redirect(`https://x.com/${data.xAccount}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchItem(params.id);
  if (!data) return {};

  return {
    openGraph: {
      images: [data.imageUrl],
    },
  };
}
