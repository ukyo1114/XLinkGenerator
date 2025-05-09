"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "./xAccountForm.module.css";

export const Input = () => {
  const [xAccount, setXAccount] = useState("");
  const [pic, setPic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pic) {
      alert("画像が選択されていません");
      return;
    }

    const formData = new FormData();
    formData.append("xAccount", xAccount);
    formData.append("image", pic);

    try {
      const response = await axios.post("/api/generate-link", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setGeneratedUrl(response.data.url);

      // フォームのリセット
      setXAccount("");
      setPic(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPic(file);
      // プレビューURLを作成
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCopyUrl = async () => {
    if (generatedUrl) {
      try {
        await navigator.clipboard.writeText(generatedUrl);
        setCopyStatus("copied");
        setTimeout(() => setCopyStatus("idle"), 2000);
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="xAccount">XのアカウントID</label>
        <input
          id="xAccount"
          type="text"
          value={xAccount}
          onChange={(e) => setXAccount(e.target.value)}
          placeholder="XのアカウントIDを入力してね"
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="pic">画像</label>
        <input
          id="pic"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        {previewUrl && (
          <div className={styles.previewContainer}>
            <Image
              src={previewUrl}
              alt="プレビュー"
              className={styles.preview}
              width={300}
              height={300}
              style={{ objectFit: "contain" }}
            />
          </div>
        )}
      </div>
      <button type="submit" className={styles.submitButton}>
        アップロード
      </button>
      {generatedUrl && (
        <div className={styles.urlContainer}>
          <p>生成されたURL:</p>
          <div className={styles.urlWrapper}>
            <a
              href={generatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.url}
            >
              {generatedUrl}
            </a>
            <button
              type="button"
              onClick={handleCopyUrl}
              className={`${styles.copyButton} ${copyStatus === "copied" ? styles.copied : ""}`}
            >
              {copyStatus === "copied" ? "コピー完了" : "コピー"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
