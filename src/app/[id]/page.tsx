"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchItem } from "@/util/fetchItem";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const router = useRouter();
  const [data, setData] = useState<{ xAccount: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkData = async () => {
      try {
        const result = await fetchItem(params.id);
        if (!result) {
          router.push("/not-found");
          return;
        }
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/not-found");
      } finally {
        setIsLoading(false);
      }
    };
    checkData();
  }, [params.id, router]);

  if (isLoading) {
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

  if (!data) {
    return null;
  }

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
      <p style={{ marginBottom: "40px" }}>@{data.xAccount}</p>
      <a
        href={`https://x.com/${data.xAccount}`}
        style={{
          display: "inline-block",
          padding: "20px 40px",
          fontSize: "24px",
          backgroundColor: "#1DA1F2",
          color: "white",
          textDecoration: "none",
          borderRadius: "50px",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
        }}
      >
        Jump to X Profile
      </a>
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
