import { fetchItem } from "@/util/fetchItem";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

type PageProps = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function Page(props: PageProps) {
  const data = await fetchItem(props.params.id);
  if (!data) redirect("/not-found");

  redirect(`https://x.com/${data.xAccount}`);
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const data = await fetchItem(props.params.id);
  if (!data) return {};

  return {
    openGraph: {
      images: [data.imageUrl],
    },
  };
}
