"use client";
import { IGetProfileResponseData } from "@/app/api/user-service/getProfile/index.model";
import Button from "@/components/molecules/button/Button";
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
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const [data, setData] = useState<IGetProfileResponseData>();
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const [cropData, setCropData] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
  } | null>(null);
  const fileInputRefs = useRef<HTMLInputElement | null>(null);

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
    setCropData(null);
  };

  function formattedPhone(phone: string) {
    const code = "+62";
    const value = phone;
    const combinedValue = code.concat(value);

    return combinedValue;
  }

  const onSubmit = async (dataForm: ProfileFormType) => {
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

        if (cropData) {
          formData.append("cropData", JSON.stringify(cropData));
        }

        // Trigger upload gambar
        await triggerPhoto(
          {
            method: "POST",
            body: formData,
          },
          {
            onSuccess: (data) => {
              photoUrl = data.data.url;
            },
            onError: (error) => {
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
              const storeData = {
                id: res.id,
                address: res.address,
                email: res.email,
                image: res.image,
                phoneNumber: res.phoneNumber,
                username: res.username,
              };
              if (data.username !== res.data.username) {
                localStorage.setItem("user", JSON.stringify(storeData));
                window.location.href = `/profile/${cleanUsername}`;
              }
            },
            onError: (error) => {
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
        },
        onError: (err) => {
          console.log(err);
        },
      },
    );
  }, []);

  useEffect(() => {
    if (data) {
      if (data.username) setValue("name", data.username || "");
      if (data.email) setValue("email", data.email || "");
      if (data.phoneNumber) setValue("phoneNumber", data.phoneNumber.slice(3).trim() || "");
      if (data.address) setValue("address", data.address || "");
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (tempPreview) {
        URL.revokeObjectURL(tempPreview);
      }
    };
  }, [tempPreview]);

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
    </section>
  );
}
