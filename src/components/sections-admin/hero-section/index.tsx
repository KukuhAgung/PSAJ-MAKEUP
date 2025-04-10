"use client";
import Button from "@/components/molecules/button/Button";
import Image from "next/image";
import { Rozha_One } from 'next/font/google';
import { StarIcon } from "@/icons";
import { Edit_foto } from "@/icons";
import Avatar from "@/components/molecules/avatar/Avatar";
import { useState, useRef, useEffect } from "react";

const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin"],
});

// Simple toast notification component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${
      type === 'success' ? 'bg-primary-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {message}
    </div>
  );
};

export const HeroSection = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Fetch current hero image on component mount
  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch('/api/hero');
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
          setImagePreview(data.data.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching hero image:", error);
      }
    };

    fetchHeroImage();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a temporary preview
    const preview = URL.createObjectURL(file);
    
    // Simply set the preview and show confirmation
    // We'll let the server handle the image processing
    setTempPreview(preview);
    setSelectedFile(file);
    setShowConfirmation(true);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      setShowConfirmation(false);
      
      // Set the preview to the temporary preview
      setImagePreview(tempPreview);

      // Upload the file
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/hero/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.code !== 200) {
        throw new Error(uploadData.message);
      }

      // Update the database with the new image URL
      const updateResponse = await fetch('/api/hero/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: uploadData.data.url,
        }),
      });

      const updateData = await updateResponse.json();

      if (updateData.code !== 200) {
        throw new Error(updateData.message);
      }

      showToast('Hero image updated successfully', 'success');
    } catch (error) {
      console.error("Error updating hero image:", error);
      showToast('Failed to update hero image', 'error');
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      setTempPreview(null);
    }
  };

  const handleCancelUpload = () => {
    setShowConfirmation(false);
    setSelectedFile(null);
    if (tempPreview) {
      URL.revokeObjectURL(tempPreview);
      setTempPreview(null);
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
          <div ref={imageContainerRef} className="flex px-8 py-10 rounded-xl relative w-fit">
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
              className="relative mask-image drop-shadow-2xl object-cover"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />

            {/* Icon Edit */}
            <button 
              onClick={handleEditClick} 
              className="absolute top-4 right-4 bg-primary-500 p-2 rounded-full shadow-lg hover:bg-primary-700 transition"
              disabled={isLoading}
            >
              <Edit_foto className="text-white w-6 h-6" />
            </button>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}

            {/* Input File Hidden */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageSelect}
              disabled={isLoading}
            />
          </div>
        </div>
      </aside>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
            <div className="flex flex-col gap-y-4">
              <h3 className="text-xl font-bold text-black">Konfirmasi Perubahan Gambar</h3>
              
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                {tempPreview && (
                  <div className="relative w-full h-full">
                    {/* Preview mask shape */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full max-w-[300px] aspect-square">
                        <Image
                          alt="preview-shape"
                          src="/images/shape/hero-shape.svg"
                          fill
                          className="absolute inset-0 mask-image"
                        />
                        <Image
                          src={tempPreview || "/placeholder.svg"}
                          alt="Preview"
                          fill
                          className="object-cover mask-image"
                          style={{ objectFit: 'cover', objectPosition: 'center' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-black opacity-70">
                Konfirmasi mengganti gambar ini?
              </p>
              
              <div className="flex gap-x-4 justify-end mt-2">
                <Button 
                  size="md" 
                  variant="outline" 
                  transparent 
                  onClick={handleCancelUpload}
                >
                  Batal
                </Button>
                <Button 
                  size="md"
                  onClick={handleConfirmUpload}
                >
                  Konfirmasi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </section>
  );
};