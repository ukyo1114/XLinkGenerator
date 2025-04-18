import type { NextApiRequest, NextApiResponse } from "next";
import { generateUrl } from "@/util/generateUrl";
import formidable from "formidable";
import { validateForm } from "@/util/validation";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({ keepExtensions: true, multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("フォームの解析中にエラーが発生しました:", err);
      res.status(500).json({ error: "フォームの解析に失敗しました" });
      return;
    }

    const xAccountField = fields.xAccount;
    const imageFiles = files.image;

    try {
      const { xAccount, buffer } = await validateForm(
        xAccountField,
        imageFiles
      );

      const url = generateUrl(xAccount, buffer);
      res.status(200).json({ url });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: String(error) });
      }
    }
  });
};
