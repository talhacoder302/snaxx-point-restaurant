import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The production host can't run next/image's built-in optimizer (it
    // needs the native `sharp` library, unavailable there — /_next/image
    // returns 400 "isn't a valid image" for every photo). Serving images
    // as-is avoids that; source images are already reasonably sized.
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      // Default is 1MB, which the offer-image upload Server Action
      // (up to 5MB, see MAX_IMAGE_BYTES in offers/actions.ts) exceeds —
      // Next.js then rejects the request before it reaches our code,
      // surfacing as a generic 500 instead of our own file-size error.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
