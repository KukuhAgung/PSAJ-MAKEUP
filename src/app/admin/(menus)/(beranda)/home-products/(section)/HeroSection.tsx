"use client";
import Button from "@/components/molecules/button/Button";
import Image from "next/image";
import { Rozha_One } from "next/font/google";
import { Edit_foto } from "@/icons";
import { useState, useRef } from "react";

const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin"],
});

export const HeroSection = () => {
  // State untuk menyimpan pratinjau gambar
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Ref untuk input file tersembunyi
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler untuk mengubah gambar saat file dipilih
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file); // Membuat URL pratinjau gambar
      setImagePreview(preview); // Memperbarui state dengan pratinjau gambar
    }
  };

  // Handler untuk membuka dialog pemilihan file saat tombol edit diklik
  const handleEditClick = () => {
    fileInputRef.current?.click(); // Memanggil input file tersembunyi
  };

  return (
    <section className="grid min-h-[90vh] w-full grid-cols-2 items-center rounded-xl bg-gradient-to-l from-primary-500 via-primary-50 to-primary-25 p-10">
      <article className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-2">
          <h1
            className={`${rozha.className} text-title-3xl font-bold text-black dark:text-white/90`}
          >
            Jelajahi Semua
            <span className="inline-block text-primary-500">Produk</span>
          </h1>
        </div>
        <p className="w-[534px] text-justify font-jakarta text-base font-medium text-black opacity-45 dark:text-white/90">
          Detail kategori makeup yang dapat kamu pilih untuk sesuaikan riasanmu
          dengan hari paling penting yang kamu tunggu-tunggu.
        </p>
        <div className="flex items-center gap-x-4">
          <Button size="md">Pesan Sekarang</Button>
          <Button size="md" variant="outline" transparent>
            Lihat Selengkapnya
          </Button>
        </div>
      </article>

      <aside className="flex h-full items-center justify-center">
        <div className="flex w-[80%] items-center rounded-3xl border border-white border-opacity-60 bg-white bg-opacity-25 px-8 py-10">
          <div className="relative flex w-fit rounded-xl px-8 py-10">
            {/* Shape sebagai Masking */}
            <Image
              priority
              alt="hero-shape"
              src="/images/shape/hero-shape.svg"
              width={420}
              height={420}
              className="mask-image absolute left-0 top-0 h-full w-full drop-shadow-lg"
            />

            {/* Gambar yang akan dimasking */}
            <Image
              priority
              alt="hero-img"
              src={imagePreview || "/images/grid-image/product-hero.png"} // Menggunakan pratinjau jika ada, atau gambar default
              width={490}
              height={490}
              className="mask-image relative drop-shadow-2xl"
            />

            {/* Tombol Edit */}
            <button
              onClick={handleEditClick}
              className="absolute right-4 top-4 rounded-full bg-primary-500 p-2 shadow-lg transition hover:bg-primary-700"
            >
              <Edit_foto className="h-6 w-6 text-white" />
            </button>

            {/* Input File Tersembunyi */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange} // Menangani perubahan file
            />
          </div>
        </div>
      </aside>
    </section>
  );
};