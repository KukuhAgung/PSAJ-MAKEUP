"use client"
import Button from "@/components/molecules/button/Button";
import { PortfolioCard } from "../../molecules/portfolio-card";
import { PortfolioData } from "./index.data";
import { useState, useRef, useEffect } from "react";
import { Edit_foto } from "@/icons";

export const PortfolioSection = () => {
  const [portfolioItems, setPortfolioItems] = useState(PortfolioData);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const originalImageSizes = useRef<{[key: number]: {width: number, height: number}}>({});

  // Menyimpan ukuran gambar asli ketika komponen di-mount
  useEffect(() => {
    // Inisialisasi ukuran gambar original jika belum ada
    portfolioItems.forEach((item) => {
      if (!originalImageSizes.current[item.id] && item.image) {
        const img = new Image();
        img.onload = () => {
          originalImageSizes.current[item.id] = {
            width: img.width,
            height: img.height
          };
        };
        img.src = item.image;
      }
    });
  }, [portfolioItems]);

  const handleEditClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Membuat URL objek untuk gambar yang diunggah
    const rawImageUrl = URL.createObjectURL(file);
    
    // Menyesuaikan ukuran gambar baru dengan ukuran gambar asli
    resizeImage(rawImageUrl, itemId).then(resizedImageUrl => {
      // Update the portfolio image with the resized image
      setPortfolioItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? { ...item, image: resizedImageUrl } : item))
      );
    });
  };

  // Fungsi untuk mengubah ukuran gambar
  const resizeImage = (imageUrl: string, itemId: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        const originalSize = originalImageSizes.current[itemId];
        
        // Jika ukuran asli tidak diketahui, simpan ukuran gambar baru dan gunakan apa adanya
        if (!originalSize) {
          originalImageSizes.current[itemId] = {
            width: img.width,
            height: img.height
          };
          resolve(imageUrl);
          return;
        }
        
        // Buat canvas untuk menggambar ulang gambar
        const canvas = document.createElement('canvas');
        canvas.width = originalSize.width;
        canvas.height = originalSize.height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Menggambar gambar pada canvas dengan ukuran yang diinginkan
          ctx.drawImage(img, 0, 0, originalSize.width, originalSize.height);
          
          // Mengonversi canvas ke URL data
          const resizedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
          resolve(resizedImageUrl);
          
          // Mengosongkan URL objek asli untuk mencegah memory leak
          URL.revokeObjectURL(imageUrl);
        } else {
          // Fallback jika context tidak tersedia
          resolve(imageUrl);
        }
      };
      
      img.onerror = () => {
        console.error("Error loading image for resizing");
        resolve(imageUrl); // Gunakan gambar asli jika terjadi error
      };
      
      img.src = imageUrl;
    });
  };

  return (
    <section
      id="gallery"
      className="relative flex min-h-screen flex-col items-center justify-center gap-y-14 overflow-hidden rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20"
    >
      <div className="absolute left-56 top-32 -z-10 h-[350px] w-[435px] bg-gradient-to-b bg-primary-500 blur-[136px] opacity-70"></div>
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-[56px] font-semibold">
          Portfolio
        </h1>
        <h6 className="text-center font-jakarta text-base font-medium">
          Periksa portofolio dan testimoni dari ratusan kali pengalaman selama
          lebih dari 5 tahun berkarir.
        </h6>
      </div>
      <article className="flex items-center gap-x-8">
        {portfolioItems.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Wrapper untuk PortfolioCard dengan tombol edit */}
            <PortfolioCard data={item} />
            
            {/* Tombol Edit */}
            <button
              onClick={(e) => handleEditClick(index, e)}
              className="absolute top-4 right-4 bg-primary-500 p-2 rounded-full shadow-lg hover:bg-primary-700 transition z-10"
            >
              <Edit_foto className="text-white w-6 h-6" />
            </button>
            
            {/* Input file tersembunyi */}
            <input
              type="file"
              accept="image/*"
              ref={(el) => {
                fileInputRefs.current[index] = el;
              }}
              onChange={(e) => handleFileChange(e, item.id)}
              className="hidden"
            />
          </div>
        ))}
      </article>
      <Button>Lihat Selengkapnya</Button>
    </section>
  );
};