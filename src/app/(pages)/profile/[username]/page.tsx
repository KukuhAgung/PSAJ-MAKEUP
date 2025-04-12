"use client";
import { IGetProfileResponseData } from "@/app/api/user-service/getProfile/index.model";
import Button from "@/components/molecules/button/Button";
import Input from "@/components/organism/form/input/InputField";
import Label from "@/components/organism/form/Label";
import { useApi } from "@/hooks/useFetchApi";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoPersonCircle } from "react-icons/io5";
import { z } from "zod";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  name: z.string().min(6, "Username minimal 6 karakter"),
  email: z.string().email("Email tidak valid"),
  address: z.string().min(6, "Alamat minimal 6 karakter"),
  phoneNumber: z
    .string()
    .regex(
      /^\d{1,14}$/,
      "Nomor HP harus berupa angka dengan maksimal 14 karakter",
    ),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type ProfileFormType = z.infer<typeof profileSchema>;

export default function Profile() {
  const router = useRouter();
  const token = localStorage.getItem("token");
  const { trigger } = useApi("/api/user-service/getProfile");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [data, setData] = useState<IGetProfileResponseData>();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
  });

  function formattedPhone(phone: string) {
    const code = "+62";
    const value = phone;
    const combinedValue = code.concat(value);

    return combinedValue;
  }

  const onSubmit = async (data: ProfileFormType) => {
    const formattedData = {
      ...data,
      phoneNumber: formattedPhone(data.phoneNumber),
    };

    console.log(formattedData);
  };

  useEffect(() => {
    if (token) {
      trigger(
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
        {
          onSuccess: (res) => {
            setData(res.data);
            setIsLogin(true);
          },
        },
      );
    }
  }, [token]);

  return (
    <section className="flex min-h-[80vh] w-full max-w-[90%] flex-col items-center justify-center gap-y-12 self-center bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:max-w-[80%] lg:p-6">
      <article className="relative flex flex-col items-center gap-y-1">
        {!isLogin && !data?.image ? (
          <IoPersonCircle size={80} color="#0B132A" />
        ) : (
          <Image
            width={52}
            height={52}
            src={data?.image || "/images/user/owner.jpg"}
            alt="User"
            className="h-[52px] w-[52px] rounded-full"
          />
        )}
        <button
          type="button"
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
                {...register("name")}
                error={errors.name ? true : false}
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
                {...register("email")}
                error={errors.email ? true : false}
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
                {...register("address")}
                error={errors.address ? true : false}
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
                error={errors.phoneNumber ? true : false}
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
          <div className="flex items-center gap-x-6">
            <Button
              size="sm"
              variant="outline"
              transparent
              className="ml-[95px] min-w-[130px] rounded-none"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="min-w-[130px] rounded-none">
              Save
            </Button>
          </div>
        </form>
      </aside>
    </section>
  );
}
