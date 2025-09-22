const getApiBase = () => {
  if (import.meta.env.DEV) {
    // running locally, Vercel API won't exist, you can skip or point to a local backend if you have one
    return "http://localhost:5000"; // if using `vercel dev` locally
  }
  // on Vercel, same domain
  return "";
};

export async function deleteCloudinaryImage(publicId: string) {
  const base = getApiBase();
  const res = await fetch(`${base}/api/delete-cloudinary-image?publicId=${publicId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete image");
  }

  return res.json();
}
