"use client"; 

import { GalleryData } from "../index.data";
import { PortfolioCard } from "@/components/molecules/portfolio-card";
import { Edit_foto } from "@/icons";
import { useState, useRef } from "react";

export const GallerySection = () => {
  // State untuk menyimpan data galeri
  const [galleryItems, setGalleryItems] = useState(GalleryData);

  // Ref untuk input file
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Fungsi untuk mengedit foto berdasarkan id
  const handleEditPhoto = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageSrc = e.target?.result as string;

        // Memperbarui item dengan foto baru berdasarkan id
        setGalleryItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, image: newImageSrc } : item
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section
      id="gallery"
      className="flex min-h-screen flex-col items-center justify-center gap-y-14 overflow-hidden rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20"
    >
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-[56px] font-semibold">
          Galeri
        </h1>
        <h6 className="text-center font-jakarta text-base font-medium">
          Setiap wajah memiliki keunikan, dan kami hadir untuk mempercantiknya.
          Temukan inspirasi riasan terbaik di sini!
        </h6>
      </div>
      <article className="grid grid-cols-3 items-center gap-8">
        {galleryItems.map((item) => (
          <div key={item.id} className="relative">
            {/* Portofolio Card */}
            <PortfolioCard data={item} />

            {/* Icon Edit */}
            <button
              onClick={() => {
                // Memicu input file untuk foto tertentu
                fileInputRefs.current[item.id]?.click();
              }}
              className="absolute top-4 right-4 bg-primary-500 p-2 rounded-full shadow-lg hover:bg-primary-700 transition"
            >
              <Edit_foto className="text-white w-6 h-6" />
            </button>

            {/* Input File Tersembunyi untuk Foto Tertentu */}
            <input
              type="file"
              accept="image/*"
              ref={(el) => {
                if (el) fileInputRefs.current[item.id] = el;
              }}
              className="hidden"
              onChange={(e) => handleEditPhoto(item.id, e)}
            />
          </div>
        ))}
      </article>
    </section>
  );
};