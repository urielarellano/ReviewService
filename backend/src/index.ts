import express from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function listImages() {
  const res = await cloudinary.api.resources({
    type: "upload",
    resource_type: "image",
    prefix: "Testimonial-images/", // prefix must match folder exactly
  });
  console.log(res.resources.map((r:any) => r.public_id));
}

listImages();

// delete Testimonial-images image endpoint
app.delete("/delete-image/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;
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
