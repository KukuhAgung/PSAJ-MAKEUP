"use client";
import { useNavbar } from "@/context/NavbarContext";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  const { setActiveMenu } = useNavbar();
  return (
    <footer className="flex flex-col items-center justify-center gap-y-10 border-t-[0.2px] border-gray-300 p-6 py-12 dark:border-gray-700">
      <Image
        alt="footer-logo"
        src="/images/icons/fit-logo.svg"
        width={194}
        height={77}
        className="block h-fit w-[227px] self-center object-cover object-center"
      />
      <ul className="flex min-w-[542px] list-none justify-center gap-x-12 text-base">
        <Link
          href=""
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.setItem("storePath", "Beranda");
            }
            setActiveMenu("Beranda");
          }}
        >
          Beranda
        </Link>
        <Link
          href="/product"
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.setItem("storePath", "Produk");
            }
            setActiveMenu("Produk");
          }}
        >
          Produk
        </Link>
        <Link
          href="/gallery"
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.setItem("storePath", "Galeri");
            }
            setActiveMenu("Galeri");
          }}
        >
          Galeri
        </Link>
      </ul>
      <ul className="flex min-w-[180px] list-none justify-center gap-x-8">
        <Link
          href=""
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.setItem("storePath", "Beranda");
            }
            setActiveMenu("Beranda");
          }}
        >
          <Image
            alt="facebook"
            src="/images/icons/facebook-fill.svg"
            width={32}
            height={32}
            className="object-cover"
            title="facebook"
          />
        </Link>
        <Link
          href="/product"
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.setItem("storePath", "Produk");
            }
            setActiveMenu("Produk");
          }}
        >
          <Image
            alt="threads"
            src="/images/icons/threads-fill.svg"
            width={32}
            height={32}
            className="object-cover"
            title="threads"
          />
        </Link>
        <Link
          href="/gallery"
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.setItem("storePath", "Galeri");
            }
            setActiveMenu("Galeri");
          }}
        >
          <Image
            alt="instagram"
            src="/images/icons/instagram-fill.svg"
            width={32}
            height={32}
            className="object-cover"
            title="instagram"
          />
        </Link>
      </ul>
      <article className="flex w-full justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; 2025 - Lina Palugongso Make Up
        </p>
        <div className="flex items-center gap-x-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Privacy & Policy
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Terms & Conditions
          </p>
        </div>
      </article>
    </footer>
  );
};
