import { fetchItem } from "@/util/fetchItem";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const data = await fetchItem(resolvedParams.id);
  if (!data) redirect("/not-found");

  redirect(`https://x.com/${data.xAccount}`);
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const data = await fetchItem(resolvedParams.id);
  if (!data) return {};

  return {
    openGraph: {
      images: [data.imageUrl],
    },
  };
}
