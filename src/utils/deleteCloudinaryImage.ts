export async function deleteCloudinaryImage(publicId: string) {
  const res = await fetch(`/api/delete-cloudinary-image?publicId=${publicId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete image");
  }

  return res.json();
}
