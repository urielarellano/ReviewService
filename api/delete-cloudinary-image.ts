import type { VercelRequest, VercelResponse } from "@vercel/node";
import { v2 as cloudinary } from "cloudinary";

// configure Cloudinary with env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { publicId } = req.query; // comes from /api/delete-cloudinary-image?publicId=xxx
    if (!publicId || typeof publicId !== "string") {
      return res.status(400).json({ error: "Missing publicId" });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return res.status(200).json({ result });
  } catch (err: any) {
    console.error("Cloudinary delete error:", err);
    return res.status(500).json({ error: "Failed to delete image" });
  }
}
