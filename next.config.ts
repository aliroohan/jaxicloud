import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.jaxicloud.com" },
      { protocol: "https", hostname: "video.wixstatic.com" },
      { protocol: "https", hostname: "static.wixstatic.com" },
    ],
  },
  serverExternalPackages: ["mongoose", "bcryptjs"],
};

export default nextConfig;
