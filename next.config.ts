import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The production host can't run next/image's built-in optimizer (it
    // needs the native `sharp` library, unavailable there — /_next/image
    // returns 400 "isn't a valid image" for every photo). Serving images
    // as-is avoids that; source images are already reasonably sized.
    unoptimized: true,
  },
};

export default nextConfig;
