"use client"
import GridShape from "@/components/organism/common/GridShape";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />
      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          ERROR 404
        </h1>

        <Image
                  src="/images/error/logo.png"
                  alt="404"
                  className="dark:hidden w-full"
                  width={320}
                  height={140}
                />
                <Image
                  src="/images/error/logo-dark.png"
                  alt="404"
                  className="hidden dark:block w-full"
                  width={320}
                  height={140}
                />

        <p className="mt-8 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          Kami tidak dapat menemukan halaman yang anda cari!
        </p>

        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          Halaman Sebelumnya
        </button>
      </div>
      {/* <!-- Footer --> */}
      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - Lina Palugongso Make Up
      </p>
    </div>
  );
}
