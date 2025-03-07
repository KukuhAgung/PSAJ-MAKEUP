"use client";
import Button from "@/components/molecules/button/Button";
import Image from "next/image";
import { Rozha_One } from "next/font/google";
import { StarIcon } from "@/icons";
import { Edit_foto } from "@/icons";
import Avatar from "@/components/molecules/avatar/Avatar";
import { useState, useRef } from "react";

const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin"],
});

export const HeroSection = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="min-h-[90vh] w-full grid grid-cols-2 items-center rounded-xl bg-gradient-to-l from-primary-500 via-primary-50 to-primary-25 p-10">
      <article className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-2">
          <p className="text-sm font-medium text-black dark:text-white/90">
            Kami hadir untuk mempercantik hari-hari spesial Anda
          </p>
          <h1 className={`${rozha.className} text-title-3xl font-bold text-black dark:text-white/90`}>
            Spesialis <span className="inline-block text-primary-500">Make Up</span> Kamu
          </h1>
        </div>
        <p className="text-base font-medium font-jakarta text-black opacity-45 dark:text-white/90 w-[534px] text-justify">
          Nikmati layanan terbaik untuk kecantikan dan perawatan diri Anda. Kami hadir untuk memenuhi kebutuhan Anda dengan produk dan layanan berkualitas tinggi.
        </p>
        <div className="flex gap-x-4 items-center">
          <Button size="md">Pesan Sekarang</Button>
          <Button size="md" variant="outline" transparent>
            Lihat Selengkapnya
          </Button>
        </div>
        <div className="flex gap-x-4 w-fit">
          <div className="flex items-center">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={`relative border-2 border-white rounded-full ${index !== 0 ? "-ml-4" : ""}`}>
                <Avatar src="/images/user/user-01.jpg" size="xxlarge" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-y-1 justify-center">
            <div className="flex gap-x-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon key={index} />
              ))}
              4.7
            </div>
            <p className="text-sm text-black opacity-45 dark:text-white/90">
              from 5,000+ <span className="font-bold underline">reviews</span>
            </p>
          </div>
        </div>
      </article>

      <aside className="flex justify-center items-center h-full">
        <div className="flex items-center px-8 py-10 bg-white bg-opacity-25 border border-white border-opacity-60 rounded-3xl w-[80%] relative">
          <div className="flex px-8 py-10 rounded-xl relative w-fit">
            {/* Shape sebagai Masking */}
            <Image
              alt="hero-shape"
              src="/images/shape/hero-shape.svg"
              width={420}
              height={420}
              className="absolute top-0 left-0 w-full h-full mask-image drop-shadow-lg"
            />
            
            {/* Gambar yang akan dimasking */}
            <Image
              alt="hero-img"
              src={imagePreview || "/images/grid-image/hero-image.png"}
              width={490}
              height={490}
              className="relative mask-image drop-shadow-2xl"
            />

            {/* Icon Edit */}
            <button onClick={handleEditClick} className="absolute top-4 right-4 bg-primary-500 p-2 rounded-full shadow-lg hover:bg-primary-700 transition">
              <Edit_foto className="text-white w-6 h-6" />
            </button>

            {/* Input File Hidden */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </aside>
    </section>
  );
};
