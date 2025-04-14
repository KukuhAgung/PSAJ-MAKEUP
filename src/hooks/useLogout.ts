"use client"
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useApi } from "./useFetchApi";

const useLogout = () => {
  const router = useRouter();
  const { trigger } = useApi("/api/user-service/logout");
  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    trigger(
      { method: "POST" },
      {
        onSuccess: () => {
          router.replace("/");
          window.location.reload();
        },
      },
    );
  }, [trigger, router]);

  return logout;
};

export default useLogout;
