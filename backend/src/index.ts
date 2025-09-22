import express from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: !!process.env.CLOUDINARY_API_KEY,
  api_secret: !!process.env.CLOUDINARY_API_SECRET,
});

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


// delete Testimonial-images image endpoint
app.delete("/api/delete-cloudinary-image", async (req, res) => {
  try {
    const publicId = req.query.publicId as string;
    console.log("Deleting Cloudinary image with publicId:", publicId);
    if (!publicId) return res.status(400).json({ error: "Missing publicId" });


    const result = await cloudinary.uploader.destroy(publicId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});