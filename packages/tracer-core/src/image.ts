export async function decodeImageToImageData(
  source: Blob,
  maxEdge?: number,
): Promise<ImageData> {
  const bitmap = await createImageBitmap(source);
  try {
    let { width, height } = bitmap;
    if (maxEdge && Math.max(width, height) > maxEdge) {
      const scale = maxEdge / Math.max(width, height);
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));
    }
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Could not create canvas context");
    ctx.drawImage(bitmap, 0, 0, width, height);
    return ctx.getImageData(0, 0, width, height);
  } finally {
    bitmap.close();
  }
}

export function imageDataToPreviewUrl(data: ImageData): string {
  const canvas = document.createElement("canvas");
  canvas.width = data.width;
  canvas.height = data.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");
  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL("image/png");
}
