/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "jenniferkeittpointofview.wordpress.com" },
      { protocol: "https", hostname: "jenniferkeittpointofview.files.wordpress.com" },
      { protocol: "https", hostname: "cmsatoday.com" },
      { protocol: "https", hostname: "gcp-na-images.contentstack.com" },
    ],
  },
  experimental: {
    // Force these to be loaded by Node at runtime, never bundled by webpack.
    // pdfjs-dist (pulled in by pdf-parse v2) is ESM and breaks under webpack's
    // RSC transform with "Object.defineProperty called on non-object".
    serverComponentsExternalPackages: [
      "pdf-parse",
      "pdfjs-dist",
      "@anthropic-ai/sdk",
      "@react-pdf/renderer",
    ],
  },
  webpack: (config, { isServer }) => {
    // Defensive: if anything ever tries to pull a Node core module into the
    // browser bundle, stub it out instead of failing the build.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
