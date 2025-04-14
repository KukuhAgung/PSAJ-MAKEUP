import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    // Tambahkan aturan untuk memproses file SVG dengan @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Daftar domain yang diizinkan untuk gambar
    domains: [
      "lh3.googleusercontent.com", // Domain Google (jika digunakan)
      "gcgumlekjiweocaciwqz.supabase.co", // Domain Supabase Storage
    ],
  },
};

export default nextConfig;
