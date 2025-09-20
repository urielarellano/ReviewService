// usage: 
// const newFile = resizeImage(oldFile, 500, 500, 0.8)

export async function resizeImage(
  file: File,
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.7
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return reject("FileReader failed");
      img.src = e.target.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // scale down while preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width = width * scale;
        height = height * scale;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context not available");

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Canvas is empty");

          // convert Blob → File
          const resizedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          resolve(resizedFile);
        },
        "image/jpeg", // format
        quality // compression (0–1)
      );
    };

    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}
