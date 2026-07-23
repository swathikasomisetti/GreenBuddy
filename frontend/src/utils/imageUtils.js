import { resolvePhotoUrl } from "../api/plantApi";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80",
  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80",
  "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=1200&q=80",
  "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=1200&q=80",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80",
  "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=1200&q=80",
];

export function getPlantImage(plant) {
  const image = plant?.imageUrl?.trim();

  // Uploaded image
  if (image) {
    if (
      image.startsWith("/uploads") ||
      image.startsWith("uploads")
    ) {
      return resolvePhotoUrl(image);
    }

    // Internet URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }
  }

  // Same fallback for the same plant forever
  return FALLBACK_IMAGES[(plant?.id || 0) % FALLBACK_IMAGES.length];
}