import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Full-resolution originals of Talia's own Behance projects.
    remotePatterns: [{ protocol: "https", hostname: "mir-s3-cdn-cf.behance.net", pathname: "/project_modules/**" }],
    qualities: [75, 90],
  },
};

export default nextConfig;
