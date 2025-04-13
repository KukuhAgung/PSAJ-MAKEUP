/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import AnimateButton from "@/components/molecules/animate-button/AnimateButton";
import { Edit_foto } from "@/icons";
import type { CarouselProps } from "./index.model";
import ImageEditor from "./ImageEditor";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";

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

export const ProductCarousel: React.FC<CarouselProps> = ({ items }) => {
  const [products, setProducts] = useState(items);
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [cropData, setCropData] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
  } | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        const data = await response.json();

        if (data.code === 200 && data.data) {
          // Map the API data to match our component's expected format
          const mappedProducts = data.data.map((product: any) => ({
            id: product.id,
            image: product.imageUrl,
            button: product.category,
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleEditClick = (index: number, e: React.MouseEvent) => {
    // Prevent event propagation to other elements
    e.stopPropagation();

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click();
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    productId: number,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a temporary preview
    const imageUrl = URL.createObjectURL(file);
    setTempPreview(imageUrl);
    setSelectedFile(file);
    setShowConfirmation(productId);
    setCropData(null); // Reset crop data for new image
  };

  const handleCropSave = (data: {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
  }) => {
    setCropData(data);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile || showConfirmation === null) return;

    const productId = showConfirmation;

    try {
      setIsLoading(productId);
      setShowConfirmation(null);

      // Update the UI immediately with the temporary preview
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, image: tempPreview || product.image }
            : product,
        ),
      );

      // Upload the file
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("productId", productId.toString());

      // Add crop data if available
      if (cropData) {
        formData.append("cropData", JSON.stringify(cropData));
      }

      const uploadResponse = await fetch("/api/product/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.code !== 200) {
        throw new Error(uploadData.message);
      }

      // Update the database with the new image URL
      const updateResponse = await fetch("/api/product/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          imageUrl: uploadData.data.url,
        }),
      });

      const updateData = await updateResponse.json();

      if (updateData.code !== 200) {
        throw new Error(updateData.message);
      }

      // Update the product in state with the final URL from the server
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, image: uploadData.data.url }
            : product,
        ),
      );

      showToast("Product image updated successfully", "success");
    } catch (error) {
      console.error("Error updating product image:", error);
      showToast("Failed to update product image", "error");
    } finally {
      setIsLoading(null);
      setSelectedFile(null);
      setCropData(null);
      if (tempPreview) {
        URL.revokeObjectURL(tempPreview);
        setTempPreview(null);
      }
    }
  };

  const handleCancelUpload = () => {
    setShowConfirmation(null);
    setSelectedFile(null);
    setCropData(null);
    if (tempPreview) {
      URL.revokeObjectURL(tempPreview);
      setTempPreview(null);
    }
  };

  return (
    <>
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        mousewheel={{ forceToAxis: true }}
        scrollbar={{ draggable: true }}
        modules={[Mousewheel]}
        className="w-full overflow-hidden"
      >
        {products.map((item, index) => (
          <SwiperSlide key={item.id} className="relative">
            <div className="relative">
              <Image
                loading="lazy"
                alt={`product-${item.id}`}
                src={item.image || "/placeholder.svg"}
                width={500}
                height={500}
                className="h-[590px] w-full rounded-lg object-cover"
              />
              {/* Edit button */}
              <button
                onClick={(e) => handleEditClick(index, e)}
                className="absolute right-4 top-4 z-10 rounded-full bg-primary-500 p-2 shadow-lg transition hover:bg-primary-700"
                disabled={isLoading !== null}
              >
                <Edit_foto className="h-6 w-6 text-white" />
              </button>
              {/* Loading indicator */}
              {isLoading === item.id && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50">
                  <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={(el) => {
                  fileInputRefs.current[index] = el;
                }}
                onChange={(e) => handleFileChange(e, item.id)}
                className="hidden"
                disabled={isLoading !== null}
              />
            </div>
            <div className="absolute inset-0 flex items-end justify-center pb-10">
              <AnimateButton>{item.button}</AnimateButton>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Confirmation Popup with Image Editor */}
      {showConfirmation !== null && tempPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="flex flex-col gap-y-4">
              <h3 className="text-xl font-bold text-black">
                Konfirmasi Perubahan Gambar
              </h3>

              {/* Image Editor Component */}
              <ImageEditor
                src={tempPreview || "/placeholder.svg"}
                onSave={handleCropSave}
              />

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
    </>
  );
};
