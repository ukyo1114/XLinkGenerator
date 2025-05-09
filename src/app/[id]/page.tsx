import { fetchItem } from "@/util/fetchItem";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export default async function RedirectPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const data = await fetchItem(id);
  if (!data) redirect("/not-found");

  redirect(`https://x.com/${data.xAccount}`);
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchItem(id);
  if (!data) return {};

  return {
    openGraph: {
      images: [data.imageUrl],
    },
  };
}
