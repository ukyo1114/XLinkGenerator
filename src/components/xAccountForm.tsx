"use client";

import React, { useState } from "react";
import axios from "axios";

export const Input = () => {
  const [xAccount, setXAccount] = useState("");
  const [pic, setPic] = useState<File | null>(null);

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

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="xAccount">XのアカウントID</label>
        <input
          id="xAccount"
          type="text"
          value={xAccount}
          onChange={(e) => setXAccount(e.target.value)}
          placeholder="XのアカウントIDを入力してね"
        />
      </div>
      <div>
        <label htmlFor="file">画像</label>
        <input
          id="pic"
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setPic(e.target.files[0]);
            }
          }}
        />
      </div>
      <button type="submit">アップロード</button>
    </form>
  );
};
