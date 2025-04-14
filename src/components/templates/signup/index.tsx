"use client";
import Input from "@/components/organism/form/input/InputField";
import Button from "@/components/molecules/button/Button";
import {
  ChevronLeftIcon,
  EyeCloseIcon,
  EyeIcon,
  UserIcon,
  LockIcon,
} from "@/icons";
import Link from "next/link";
import { useState } from "react";
import { Backdrop } from "../backdrop";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiPhone } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";
import { useBackdrop } from "@/context/BackdropContext";
import { useApi } from "@/hooks/useFetchApi";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phoneNumber: z
    .string()
    .regex(
      /^\d{1,14}$/,
      "Nomor HP harus berupa angka dengan maksimal 14 karakter",
    ),
});

type LoginFormType = z.infer<typeof loginSchema>;

export const SignUp = () => {
  const { trigger } = useApi("/api/auth/register");
  const { setIsRegister, setBackdrop } = useBackdrop();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  function formattedPhone(phone: string) {
    const code = "+62";
    const value = phone;
    const combinedValue = code.concat(value);

    return combinedValue;
  }

  const onSubmit = async (data: LoginFormType) => {
    const formattedData = {
      ...data,
      phoneNumber: formattedPhone(data.phoneNumber),
    };

    try {
      await trigger(
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: formattedData,
        },
        { onSuccess: () => setIsRegister(false) },
      );
    } catch (error) {
      console.error("Failed Registration:", error);
    }
  };

  return (
    <Backdrop>
      <article className="mx-auto flex max-w-screen-sm flex-1 flex-col border border-primary-500 bg-white p-6 sm:rounded-none sm:border-0 sm:p-8 md:rounded-3xl">
        <div className="mx-auto w-full max-w-md pb-10">
          <button
            type="button"
            onClick={() => setBackdrop(false)}
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Kembali
          </button>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <div>
            <div className="mb-5 text-center sm:mb-8">
              <h1 className="mb-2 text-title-sm font-semibold text-gray-800 dark:text-white/90 sm:text-title-md">
                Selamat Datang!
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Segera buat akunmu agar proses booking jadi lebih cepat
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  {/* User Input */}
                  <div>
                    <Input
                      iconLeft={<UserIcon />}
                      {...register("username")}
                      error={errors.username ? true : false}
                      placeholder="Username"
                    />
                    {errors.username && (
                      <p className="text-sm text-error-500">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <Input
                      iconLeft={<MdOutlineMail size={20} fontWeight={400} />}
                      {...register("email")}
                      error={errors.email ? true : false}
                      placeholder="Email"
                    />
                    {errors.email && (
                      <p className="text-sm text-error-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="relative">
                      <Input
                        iconLeft={<LockIcon />}
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-error-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* No HP Input */}
                  <div>
                    <Input
                      type="text"
                      inputMode="numeric"
                      min={0}
                      iconLeft={
                        <div className="flex items-center gap-x-2 border-r-2 border-gray-500 border-opacity-50 pr-2 dark:border-gray-400">
                          <FiPhone size={20} />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            +62
                          </span>
                        </div>
                      }
                      {...register("phoneNumber")}
                      error={errors.phoneNumber ? true : false}
                      placeholder="No. HP"
                      className="pl-[74px]"
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-error-500">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      href="/reset-password"
                      className="text-sm text-primary-500 underline hover:text-primary-600 dark:text-primary-400"
                    >
                      Lupa kata sandi?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <Button type="submit" className="w-full" size="sm">
                      Daftar
                    </Button>
                  </div>
                </div>
              </form>

              <div className="mt-5 w-full">
                <p className="text-sm font-normal text-gray-700 dark:text-gray-400 sm:text-start md:text-center">
                  Sudah Punya Akun? {""}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="text-center text-primary-500 underline hover:text-primary-600 dark:text-primary-400"
                  >
                    Masuk Sekarang
                  </button>
                </p>
              </div>

              <div className="relative py-3 sm:py-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white p-2 text-gray-400 dark:bg-gray-900 sm:px-5 sm:py-2">
                    Atau Masuk Dengan
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                <button
                  onClick={() => signIn("facebook", { callbackUrl: "/" })}
                  className="inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                >
                  <svg
                    width="24"
                    height="20"
                    viewBox="0 0 534 534"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_534_588)">
                      <path
                        d="M533.667 267.001C533.667 119.725 414.277 0.333984 267.001 0.333984C119.725 0.333984 0.333984 119.725 0.333984 267.001C0.333984 400.102 97.85 510.423 225.334 530.428V344.084H157.626V267.001H225.334V208.251C225.334 141.417 265.145 104.501 326.058 104.501C355.234 104.501 385.751 109.709 385.751 109.709V175.334H352.125C318.998 175.334 308.668 195.89 308.668 216.979V267.001H382.626L370.803 344.084H308.667V530.428C436.151 510.423 533.667 400.102 533.667 267.001Z"
                        fill="#1877F2"
                      />
                      <path
                        d="M370.802 344.083L382.625 267H308.666V216.977C308.666 195.889 318.997 175.333 352.124 175.333H385.75V109.708C385.75 109.708 355.233 104.5 326.057 104.5C265.145 104.5 225.333 141.416 225.333 208.25V267H157.625V344.083H225.333V530.427C239.117 532.587 253.048 533.67 267 533.667C281.175 533.667 295.09 532.557 308.666 530.427V344.083H370.802Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_534_588">
                        <rect width="534" height="534" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Facebook
                </button>
                <button
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                      fill="#EB4335"
                    />
                  </svg>
                  Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Backdrop>
  );
};
