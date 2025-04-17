"use client";
import { IGetProfileResponseData } from "@/app/api/user-service/getProfile/index.model";
import Button from "@/components/molecules/button/Button";
import { Modal } from "@/components/molecules/modal";
import Input from "@/components/organism/form/input/InputField";
import Label from "@/components/organism/form/Label";
import { useApi } from "@/hooks/useFetchApi";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoPersonCircle } from "react-icons/io5";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(4, "Username minimal 4 karakter"),
  email: z.string().email("Email tidak valid"),
  address: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(
      /^\d{1,14}$/,
      "Nomor HP harus berupa angka dengan maksimal 14 karakter",
    ),
  password: z.string().optional(),
});

type ProfileFormType = z.infer<typeof profileSchema>;

export default function Profile() {
  const { trigger: triggerProfile } = useApi("/api/user-service/getProfile");
  const { trigger: triggerForm } = useApi("/api/user-service/editProfile");
  const { trigger: triggerPhoto } = useApi(
    "/api/user-service/editProfile/upload",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const [data, setData] = useState<IGetProfileResponseData>();
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const fileInputRefs = useRef<HTMLInputElement | null>(null);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [cleanUsername, setCleanUsername] = useState("");

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (fileInputRefs.current) {
      fileInputRefs.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setTempPreview(imageUrl);
    setSelectedFile(file);
  };

  function formattedPhone(phone: string) {
    const code = "+62";
    const value = phone;
    const combinedValue = code.concat(value);

    return combinedValue;
  }

  const onSubmit = async (dataForm: ProfileFormType) => {
    setIsLoading(true);
    try {
      let photoUrl = "";
      // Format data form
      const formattedData = {
        ...dataForm,
        phoneNumber: formattedPhone(dataForm.phoneNumber),
      };

      // Validasi data dan file
      if (!data) return;

      if (selectedFile) {
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (selectedFile.size > maxSize) {
          alert("Ukuran file tidak boleh lebih dari 2MB.");
          return;
        }

        // Buat FormData untuk upload gambar
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userId", data.id.toString());

        // Trigger upload gambar
        await triggerPhoto(
          {
            method: "POST",
            body: formData,
          },
          {
            onSuccess: (data) => {
              if (!formattedData) {
                setIsLoading(false);
                setShowModalSuccess(true);
                return;
              }
              photoUrl = data.data.url;
            },
            onError: (error) => {
              setIsLoading(false);
              console.error("Error uploading photo:", error.message);
              alert("Gagal mengupload gambar. Silakan coba lagi.");
            },
          },
        );
      }

      if (formattedData) {
        await triggerForm(
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { ...formattedData, image: photoUrl },
          },
          {
            onSuccess: (res) => {
              const cleanUsername = formattedData.name
                ?.replace(/\s+/g, "")
                .toLowerCase();
              setCleanUsername(cleanUsername);
              const storeData = {
                id: res.id,
                address: res.address,
                email: res.email,
                image: res.image,
                phoneNumber: res.phoneNumber,
                username: res.username,
              };
              if (data.username !== res.data.username) {
                if (typeof window !== "undefined") {
                  localStorage.setItem("user", JSON.stringify(storeData));
                }
              }
               setIsLoading(false);
               setShowModalSuccess(true);
            },
            onError: (error) => {
              setIsLoading(false);
              console.error("Error updating profile:", error.message);
              alert("Gagal memperbarui profil. Silakan coba lagi.");
            },
          },
        );
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  useEffect(() => {
    triggerProfile(
      {
        method: "GET",
      },
      {
        onSuccess: (res) => {
          setData(res.data);
          setIsLoading(false);
        },
        onError: (err) => {
          console.log(err);
          setIsLoading(false);
        },
      },
    );
  }, [triggerProfile]);

  useEffect(() => {
    if (data) {
      if (data.username) setValue("name", data.username || "");
      if (data.email) setValue("email", data.email || "");
      if (data.phoneNumber)
        setValue("phoneNumber", data.phoneNumber.slice(3).trim() || "");
      if (data.address) setValue("address", data.address || "");
    }
  }, [data, setValue]);

  useEffect(() => {
    return () => {
      if (tempPreview) {
        URL.revokeObjectURL(tempPreview);
      }
    };
  }, [tempPreview]);

  if (isLoading) {
    return (
      <section className="flex h-[80vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[80vh] w-full max-w-[90%] flex-col items-center justify-center gap-y-12 self-center bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:max-w-[80%] lg:p-6">
      <article className="relative flex flex-col items-center gap-y-1">
        {!data?.image && !tempPreview ? (
          <div
            onMouseEnter={() => setHoveredProfile(true)}
            onMouseLeave={() => setHoveredProfile(false)}
            className="relative w-fit cursor-pointer"
          >
            <IoPersonCircle
              opacity={hoveredProfile ? 0.5 : 1}
              size={80}
              color="#0B132A"
            />
            {hoveredProfile && editMode ? (
              <button
                onClick={(e) => handleEditClick(e)}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm font-semibold text-gray-800 dark:text-white/90"
              >
                {!data?.image ? "Upload Foto" : "Ganti Foto"}
              </button>
            ) : null}
            <input
              type="file"
              accept="image/*"
              ref={(el) => {
                fileInputRefs.current = el;
              }}
              onChange={(e) => handleFileChange(e)}
              className="hidden"
            />
          </div>
        ) : (
          <div
            onMouseEnter={() => setHoveredProfile(true)}
            onMouseLeave={() => setHoveredProfile(false)}
            className={`${hoveredProfile && editMode ? "cursor-pointer" : "cursor-default"} relative w-fit`}
          >
            <Image
              width={80}
              height={80}
              src={tempPreview || data?.image || "/images/user/owner.png"}
              alt="User"
              className={`${hoveredProfile && editMode ? "opacity-50" : ""} h-[80px] w-[80px] rounded-full border-2 border-black/30 object-cover dark:border-white/10`}
            />
            {hoveredProfile && editMode ? (
              <button
                onClick={(e) => handleEditClick(e)}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm font-semibold text-gray-800 dark:text-white/90"
              >
                {!data?.image ? "Upload Foto" : "Ganti Foto"}
              </button>
            ) : null}
            <input
              type="file"
              accept="image/*"
              ref={(el) => {
                fileInputRefs.current = el;
              }}
              onChange={(e) => handleFileChange(e)}
              className="hidden"
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => setEditMode(!editMode)}
          className="text-sm font-semibold text-gray-800 dark:text-white/90"
        >
          Edit Profile
        </button>
      </article>
      <aside className="flex w-full justify-center md:max-w-[70%]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nama Input */}
          <div>
            <div className="flex items-center gap-x-4">
              <Label htmlFor="name" className="min-w-[80px] text-base">
                Nama
              </Label>
              <Input
                className="min-w-[300px]"
                defaultValue={data?.username || ""}
                {...register("name")}
                error={errors.name ? true : false}
                disabled={!editMode}
                placeholder="Masukkan nama baru"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-error-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <div className="flex items-center gap-x-4">
              <Label htmlFor="email" className="min-w-[80px] text-base">
                Email
              </Label>
              <Input
                className="min-w-[600px]"
                defaultValue={data?.email || ""}
                {...register("email")}
                error={errors.email ? true : false}
                disabled={!editMode}
                placeholder="Masukkan email baru"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-error-500">{errors.email.message}</p>
            )}
          </div>

          {/* Alamat Input */}
          <div>
            <div className="flex items-center gap-x-4">
              <Label htmlFor="address" className="min-w-[80px] text-base">
                Alamat
              </Label>
              <Input
                className="min-w-[600px]"
                defaultValue={data?.address || ""}
                {...register("address")}
                error={errors.address ? true : false}
                disabled={!editMode}
                placeholder="Masukkan alamat baru"
              />
            </div>
            {errors.address && (
              <p className="text-sm text-error-500">{errors.address.message}</p>
            )}
          </div>

          {/* No HP Input */}
          <div>
            <div className="flex items-center gap-x-4">
              <Label htmlFor="email" className="min-w-[80px] text-base">
                No. HP
              </Label>
              <Input
                type="text"
                inputMode="numeric"
                min={0}
                iconLeft={
                  <div className="flex items-center gap-x-2 border-r-2 border-gray-500 border-opacity-50 pr-2 dark:border-gray-400">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      +62
                    </span>
                  </div>
                }
                {...register("phoneNumber")}
                defaultValue={
                  data?.phoneNumber ? data.phoneNumber.slice(3).trim() : ""
                }
                error={errors.phoneNumber ? true : false}
                disabled={!editMode}
                placeholder="No. HP"
                className="min-w-[600px] pl-[48px]"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-error-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="relative flex items-center gap-x-4">
              <Label htmlFor="password" className="min-w-[80px] text-base">
                Password
              </Label>
              <Input
                className="min-w-[600px]"
                iconRight={
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                }
                {...register("password")}
                disabled={!editMode}
                placeholder="Masukkan password baru"
                type={showPassword ? "text" : "password"}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-error-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          {editMode && (
            <div className="flex items-center gap-x-6">
              <Button
                size="sm"
                variant="outline"
                transparent
                className="ml-[95px] min-w-[130px] rounded-none"
                onClick={() => {
                  setSelectedFile(null);
                  setTempPreview(null);
                  setEditMode(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="min-w-[130px] rounded-none"
              >
                Save
              </Button>
            </div>
          )}
        </form>
      </aside>

      {/* Success Modal */}
      <Modal
        isOpen={showModalSuccess}
        onClose={() => setShowModalSuccess(false)}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <div className="text-center">
          <div className="relative z-1 mb-7 flex items-center justify-center">
            <svg
              className="fill-success-50 dark:fill-success-500/15"
              width="90"
              height="90"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                fill=""
                fillOpacity=""
              />
            </svg>

            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg
                className="fill-success-600 dark:fill-success-500"
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.9375 19.0004C5.9375 11.7854 11.7864 5.93652 19.0014 5.93652C26.2164 5.93652 32.0653 11.7854 32.0653 19.0004C32.0653 26.2154 26.2164 32.0643 19.0014 32.0643C11.7864 32.0643 5.9375 26.2154 5.9375 19.0004ZM19.0014 2.93652C10.1296 2.93652 2.9375 10.1286 2.9375 19.0004C2.9375 27.8723 10.1296 35.0643 19.0014 35.0643C27.8733 35.0643 35.0653 27.8723 35.0653 19.0004C35.0653 10.1286 27.8733 2.93652 19.0014 2.93652ZM24.7855 17.0575C25.3713 16.4717 25.3713 15.522 24.7855 14.9362C24.1997 14.3504 23.25 14.3504 22.6642 14.9362L17.7177 19.8827L15.3387 17.5037C14.7529 16.9179 13.8031 16.9179 13.2173 17.5037C12.6316 18.0894 12.6316 19.0392 13.2173 19.625L16.657 23.0647C16.9383 23.346 17.3199 23.504 17.7177 23.504C18.1155 23.504 18.4971 23.346 18.7784 23.0647L24.7855 17.0575Z"
                  fill=""
                />
              </svg>
            </span>
          </div>
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
            Berhasil Mengganti Profile
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Profil kamu telah berhasil diperbarui, klik konfirmasi untuk
            melanjutkan
          </p>

          <div className="mt-7 flex w-full items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setShowModalSuccess(false);
                window.location.href = `/profile/${cleanUsername}`
                window.location.reload();
              }}
              className="flex w-full justify-center rounded-lg bg-success-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-success-600 sm:w-auto"
            >
              Konfirmasi
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
