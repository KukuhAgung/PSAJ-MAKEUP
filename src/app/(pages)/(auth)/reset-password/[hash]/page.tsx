"use client";
import { Modal } from "@/components/molecules/modal";
import Input from "@/components/organism/form/input/InputField";
import Label from "@/components/organism/form/Label";
import { Button } from "@/components/ui/button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const passwordSchema = z.object({
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Password minimal 6 karakter"),
});

type FormValues = z.infer<typeof passwordSchema>;

export default function ResetNewPassword() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    console.log(data);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/");
    }
  }, [countdown, router]);

  if (isLoading) {
    return (
      <section className="flex h-[80vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-l p-10">
      <div className="mb-5 flex flex-col items-center gap-y-2">
        <h1 className="text-title-md font-bold md:text-title-lg">
          Reset Password
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Masukkan email untuk reset password
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-y-4 md:w-[400px]"
      >
        {/* New Password Input */}
        <div>
          <div className="relative">
            <Label>Password Baru</Label>
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password Baru"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 z-30 cursor-pointer"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
              )}
            </span>
          </div>
          {errors.password && (
            <p className="text-sm text-error-500">{errors.password.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div className="relative">
            <Label>Konfirmasi Password</Label>
            <Input
              {...register("confirmPassword")}
              type={showPassword ? "text" : "confirmPassword"}
              placeholder="Password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 z-30 cursor-pointer"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
              )}
            </span>
          </div>
          {errors.password && (
            <p className="text-sm text-error-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          color="primary"
          variant="default"
          className="w-full"
          size="sm"
        >
          Submit
        </Button>
      </form>

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
            Verifikasi Berhasil
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Password telah diubah anda akan dialihkan ke beranda dalam{" "}
            {countdown} detik. atau klik tombol dibawah
          </p>

          <div className="mt-7 flex w-full items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setShowModalSuccess(false);
                router.push("/");
              }}
              className="flex w-full justify-center rounded-lg bg-success-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-success-600 sm:w-auto"
            >
              Konfirmasi
            </button>
          </div>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={showModalError}
        onClose={() => setShowModalError(false)}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <div className="text-center">
          <div className="relative z-1 mb-7 flex items-center justify-center">
            <svg
              className="fill-error-50 dark:fill-error-500/15"
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
                className="fill-error-600 dark:fill-error-500"
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.62684 11.7496C9.04105 11.1638 9.04105 10.2141 9.62684 9.6283C10.2126 9.04252 11.1624 9.04252 11.7482 9.6283L18.9985 16.8786L26.2485 9.62851C26.8343 9.04273 27.7841 9.04273 28.3699 9.62851C28.9556 10.2143 28.9556 11.164 28.3699 11.7498L21.1198 18.9999L28.3699 26.25C28.9556 26.8358 28.9556 27.7855 28.3699 28.3713C27.7841 28.9571 26.8343 28.9571 26.2485 28.3713L18.9985 21.1212L11.7482 28.3715C11.1624 28.9573 10.2126 28.9573 9.62684 28.3715C9.04105 27.7857 9.04105 26.836 9.62684 26.2502L16.8771 18.9999L9.62684 11.7496Z"
                  fill=""
                />
              </svg>
            </span>
          </div>

          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
            Verifikasi Gagal
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Email yang kamu masukkan tidak terdaftar di sistem kami.
          </p>

          <div className="mt-7 flex w-full items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowModalError(false)}
              className="flex w-full justify-center rounded-lg bg-error-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-error-600 sm:w-auto"
            >
              Konfirmasi
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
