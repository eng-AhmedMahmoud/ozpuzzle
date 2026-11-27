import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production on the Devya VPS runs the standalone server (scripts/deploy-vps.sh and
  // scripts/ci-local.sh set NEXT_OUTPUT=standalone); `next dev` is unchanged.
  ...(process.env.NEXT_OUTPUT === "standalone" ? { output: "standalone" as const } : {}),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ozpuzzle.com", pathname: "/cdn/**" },
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
