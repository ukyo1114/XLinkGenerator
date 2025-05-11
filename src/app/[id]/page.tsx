"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchItem } from "@/util/fetchItem";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const router = useRouter();

  useEffect(() => {
    const checkData = async () => {
      const data = await fetchItem(params.id);
      if (!data) {
        router.push("/not-found");
      }
    };
    checkData();
  }, [params.id, router]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>X Profile</h1>
      <p style={{ marginBottom: "40px" }}>Loading...</p>
    </div>
  );
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
