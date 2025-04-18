"use client";
import Button from "@/components/molecules/button/Button";
import Image from "next/image";
import { Rozha_One } from "next/font/google";
import { StarIcon } from "@/icons";
import { Edit_foto } from "@/icons";
import Avatar from "@/components/molecules/avatar/Avatar";
import { useState, useRef, useEffect } from "react";
import { useApi } from "@/hooks/useFetchApi";
import { IReviewsApiResponse } from "@/components/sections/testimoni-section/index.model";
import { IResponseAPI } from "@/lib/index.model";
import Link from "next/link";

const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin"],
});

// Simple toast notification component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed right-4 top-4 z-50 rounded-md px-4 py-2 shadow-lg ${
        type === "success"
          ? "bg-primary-500 text-white"
          : "bg-red-500 text-white"
      }`}
    >
      {message}
    </div>
  );
};

export const HeroSection = () => {
  const { trigger: triggerReview } = useApi("/api/user-service/reviews");
  const [reviews, setReviews] = useState<IResponseAPI<IReviewsApiResponse>>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Fetch current hero image on component mount
  useEffect(() => {
    triggerReview(
      { method: "GET", data: { page: 1, size: 10 } },
      { onSuccess: (data) => setReviews(data) },
    );

    const fetchHeroImage = async () => {
      try {
        const response = await fetch("/api/hero");
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

  const showToast = (message: string, type: "success" | "error") => {
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
      formData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/hero/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.code !== 200) {
        throw new Error(uploadData.message);
      }

      // Update the database with the new image URL
      const updateResponse = await fetch("/api/hero/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadData.data.url,
        }),
      });

      const updateData = await updateResponse.json();

      if (updateData.code !== 200) {
        throw new Error(updateData.message);
      }

      showToast("Hero image updated successfully", "success");
    } catch (error) {
      console.error("Error updating hero image:", error);
      showToast("Failed to update hero image", "error");
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
    <section className="grid min-h-[90vh] w-full grid-cols-2 items-center rounded-xl bg-gradient-to-l from-primary-500 via-primary-50 to-primary-25 p-10">
      <article className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-2">
          <p className="text-sm font-medium text-black dark:text-white/90">
            Kami hadir untuk mempercantik hari-hari spesial Anda
          </p>
          <h1
            className={`${rozha.className} text-title-3xl font-bold text-black dark:text-white/90`}
          >
            Spesialis{" "}
            <span className="inline-block text-primary-500">Make Up</span> Kamu
          </h1>
        </div>
        <p className="w-[534px] text-justify font-jakarta text-base font-medium text-black opacity-45 dark:text-white/90">
          Nikmati layanan terbaik untuk kecantikan dan perawatan diri Anda. Kami
          hadir untuk memenuhi kebutuhan Anda dengan produk dan layanan
          berkualitas tinggi.
        </p>
        <div className="flex items-center gap-x-4">
          <Button size="md">Pesan Sekarang</Button>
          <Button size="md" variant="outline" transparent>
            Lihat Selengkapnya
          </Button>
        </div>
        {reviews?.data && reviews.data.reviews.length > 0 ? (
          <div className="flex w-fit gap-x-4">
            <div className="flex items-center">
              {reviews?.data.reviews.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className={`relative rounded-full border-2 border-white ${index !== 0 ? "-ml-4" : ""}`}
                >
                  {item.user.image !== null ? (
                    <Avatar
                      alt={`profile-${item.user.username}`}
                      src={item.user.image}
                      size="xxlarge"
                    />
                  ) : (
                    <div className="h-[50px] w-[50px] rounded-full bg-[#D9D9D9]"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center gap-y-1">
              <div className="flex gap-x-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} />
                ))}
                {reviews?.data.averageRating}
              </div>
              <p className="text-sm text-black opacity-45 dark:text-white/90">
                from{" "}
                {reviews && reviews.data.totalCount > 5000
                  ? "5000+"
                  : reviews?.data.totalCount}{" "}
                <Link href="#testimoni" className="font-bold underline">
                  reviews
                </Link>
              </p>
            </div>
          </div>
        ) : null}
      </article>

      <aside className="flex h-full items-center justify-center">
        <div className="relative flex w-[80%] items-center rounded-3xl border border-white border-opacity-60 bg-white bg-opacity-25 px-8 py-10">
          {!isLoading && (
            <div
              ref={imageContainerRef}
              className="relative flex w-fit rounded-xl px-8 py-10"
            >
              {/* Shape sebagai Masking */}
              <Image
                alt="hero-shape"
                src="/images/shape/hero-shape.svg"
                width={420}
                height={420}
                className="mask-image absolute left-0 top-0 h-full w-full drop-shadow-lg"
              />

              {/* Gambar yang akan dimasking */}
              <Image
                alt="hero-img"
                src={imagePreview || "/images/grid-image/hero-image.png"}
                width={490}
                height={490}
                className="mask-image relative object-cover drop-shadow-2xl"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />

              {/* Icon Edit */}
              <button
                onClick={handleEditClick}
                className="absolute right-4 top-4 rounded-full bg-primary-500 p-2 shadow-lg transition hover:bg-primary-700"
                disabled={isLoading}
              >
                <Edit_foto className="h-6 w-6 text-white" />
              </button>

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
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex h-[527px] w-[545px] items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
            </div>
          )}
        </div>
      </aside>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="flex flex-col gap-y-4">
              <h3 className="text-xl font-bold text-black">
                Konfirmasi Perubahan Gambar
              </h3>

              <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100">
                {tempPreview && (
                  <div className="relative h-full w-full">
                    {/* Preview mask shape */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative aspect-square w-full max-w-[300px]">
                        <Image
                          alt="preview-shape"
                          src="/images/shape/hero-shape.svg"
                          fill
                          className="mask-image absolute inset-0"
                        />
                        <Image
                          src={tempPreview || "/placeholder.svg"}
                          alt="Preview"
                          fill
                          className="mask-image object-cover"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-black opacity-70">
                Konfirmasi mengganti gambar ini?
              </p>

              <div className="mt-2 flex justify-end gap-x-4">
                <Button
                  size="md"
                  variant="outline"
                  transparent
                  onClick={handleCancelUpload}
                >
                  Batal
                </Button>
                <Button size="md" onClick={handleConfirmUpload}>
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
