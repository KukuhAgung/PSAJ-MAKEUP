/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AnimateButton from "@/components/molecules/animate-button/AnimateButton";
import type React from "react";

import { useState, useEffect } from "react";
import Carousel from "./component/carousel";
import type { CarouselItem } from "./component/carousel/index.model";

// Toast notification component
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

export const DescriptionSection = () => {
  const [finishedFetch, setFinishedFetch] = useState(false);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Fetch description videos on component mount
  useEffect(() => {
    const fetchDescriptionVideos = async () => {
      try {
        const response = await fetch("/api/description");
        const data = await response.json();

        if (data.code === 200 && data.data) {
          // Map the API data to match our component's expected format
          const mappedCarouselItems = data.data.map((item: any) => ({
            id: item.id,
            video: item.videoUrl,
          }));
          setCarouselItems(mappedCarouselItems);
          setFinishedFetch(true);
        }
      } catch (error) {
        console.error("Error fetching description videos:", error);
      }
    };
    fetchDescriptionVideos();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile || showConfirmation === null) return;

    const videoId = showConfirmation;

    try {
      setIsLoading(videoId);
      setShowConfirmation(null);
      setFinishedFetch(false);

      // Upload the file
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("videoId", videoId.toString());

      const uploadResponse = await fetch("/api/description/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.code !== 200) {
        throw new Error(uploadData.message);
      }

      // Update the database with the new video URL
      const updateResponse = await fetch("/api/description/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: videoId,
          videoUrl: uploadData.data.url,
        }),
      });

      const updateData = await updateResponse.json();

      if (updateData.code !== 200) {
        throw new Error(updateData.message);
      }

      // Update the carousel item in state with the final URL from the server
      setCarouselItems((prevItems) =>
        prevItems.map((item) =>
          item.id === videoId ? { ...item, video: uploadData.data.url } : item,
        ),
      );

      showToast("Video updated successfully", "success");
      setFinishedFetch(true);
    } catch (error) {
      console.error("Error updating video:", error);
      showToast("Failed to update video", "error");
    } finally {
      setIsLoading(null);
      setSelectedFile(null);
    }
  };

  const handleCancelUpload = () => {
    setShowConfirmation(null);
    setSelectedFile(null);
  };

  return (
    <section className="relative grid min-h-[80vh] w-full grid-cols-2 items-center gap-x-20 p-10">
      <div className="absolute -left-32 top-20 -z-10 h-[350px] w-[435px] bg-gradient-to-b from-primary-500 to-white opacity-70 blur-[88px]"></div>
      <aside className="relative flex justify-center">
        <div className="relative">
          {finishedFetch && (
            <Carousel
              showToast={showToast}
              isLoading={isLoading}
              setSelectedFile={setSelectedFile}
              setShowConfirmation={setShowConfirmation}
              items={carouselItems}
              baseWidth={600}
              autoplay={true}
              autoplayDelay={3000}
              pauseOnHover={true}
              loop={true}
              round={false}
            />
          )}
          {/* Loading indicator */}
          {isLoading !== null && (
            <div className="flex h-[527px] w-[545px] items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </aside>
      <article className="flex flex-col justify-center gap-y-9">
        <h1 className="font-jakarta text-title-lg font-medium">
          Pesona Kecantikan <span className="block">Dalam Setiap</span> Sapuan
        </h1>
        <p className="text-justify font-jakarta text-base font-medium text-black opacity-60">
          Setiap wajah memiliki keunikan, dan setiap sentuhan riasan membawa
          cerita tersendiri. Melalui video-video ini, lihat bagaimana kami
          menghadirkan tampilan terbaik untuk setiap momen spesial Anda. Dari
          riasan natural hingga glamor, semua dikerjakan dengan detail dan
          profesionalisme.
        </p>
        <AnimateButton>Lihat Produk</AnimateButton>
      </article>

      {/* Confirmation Popup */}
      {showConfirmation !== null && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="flex flex-col gap-y-4">
              <h3 className="text-xl font-bold text-black">
                Konfirmasi Perubahan Video
              </h3>

              <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100">
                <video
                  src={URL.createObjectURL(selectedFile)}
                  className="h-full w-full object-cover"
                  controls
                  muted
                />
              </div>

              <p className="text-black opacity-70">
                Konfirmasi mengganti video ini?
              </p>

              <div className="mt-2 flex justify-end gap-x-4">
                <button
                  className="rounded-md border border-gray-300 px-4 py-2 transition hover:bg-gray-100"
                  onClick={handleCancelUpload}
                >
                  Batal
                </button>
                <button
                  className="rounded-md bg-primary-500 px-4 py-2 text-white transition hover:bg-primary-600"
                  onClick={handleConfirmUpload}
                >
                  Konfirmasi
                </button>
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
