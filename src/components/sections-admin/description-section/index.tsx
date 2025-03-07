"use client";
import Button from "@/components/molecules/button/Button";
import { ArrowRightIcon, Edit_foto } from "@/icons";
import Image from "next/image";
import { useState, useRef } from "react";

export const DescriptionSection = () => {
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
    <section className="relative min-h-screen w-full grid grid-cols-2 gap-x-20 items-center">
      <aside className="flex items-center justify-center bg-primary-500 bg-opacity-10 border border-white border-opacity-60 rounded-xl px-8 py-10 w-fit h-[80%] relative">
        <Image
          alt="hero-img"
          src={imagePreview || "/images/grid-image/hero-image.png"}
          width={480}
          height={480}
          className="relative min-h-[90%] rounded-3xl"
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
      </aside>

      <article className="flex flex-col gap-y-9 justify-center">
        <h1 className="font-jakarta text-title-lg font-medium">
          Pesona Kecantikan <span className="block">Dalam Setiap</span> Sapuan
        </h1>
        <p className="font-jakarta font-medium text-base text-black opacity-60 text-justify">
          Setiap wajah memiliki keunikan, dan setiap sentuhan riasan membawa cerita tersendiri. Melalui video-video ini, lihat bagaimana kami menghadirkan tampilan terbaik untuk setiap momen spesial Anda. Dari riasan natural hingga glamor, semua dikerjakan dengan detail dan profesionalisme.
        </p>
        <Button
          size="md"
          className="w-[180px]"
          endIcon={
            <div className="absolute right-2 w-fit h-fit rounded-full bg-white text-black px-2 py-2">
              <ArrowRightIcon />
            </div>
          }
        >
          Lihat Produk
        </Button>
      </article>
    </section>
  );
};
