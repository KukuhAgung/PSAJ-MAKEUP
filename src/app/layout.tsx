import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import CustomProvider from "@/layout/CustomProvider";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linapalugongso | Makeup Artist",
  icons: "./favicon.ico",
  description: "Spesialis Youth Makeup Artist di Purwokerto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} dark:bg-gray-900 overflow-x-hidden`}>
        <CustomProvider>
          {children}
        </CustomProvider>
      </body>
    </html>
  );
}
