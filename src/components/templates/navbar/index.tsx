"use client";
import Image from "next/image";
import Button from "@/components/molecules/button/Button";
import { motion, Variants } from "framer-motion";
import { useNavbar } from "@/context/NavbarContext";
import NavItem from "./component/NavItem";
import { useBackdrop } from "@/context/BackdropContext";
import { useApi } from "@/hooks/useFetchApi";
import { useEffect, useState } from "react";
import { IGetProfileResponseData } from "@/app/api/user-service/getProfile/index.model";
import { UserDropdown } from "../header/UserDropdown";
import { menus } from "./index.data";

export const Navbar = () => {
  const token = localStorage.getItem("token");
  const { trigger } = useApi("/api/user-service/getProfile");
  const { setBackdrop, setIsRegister } = useBackdrop();
  const { activeMenu, setActiveMenu, yValue, setHovered } = useNavbar();
  const [isLogin, setIsLogin] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<IGetProfileResponseData>();

  const variants: Variants = {
    normal: {
      background: "rgba(255, 255, 255, 0.2)",
    },
    scroll: {
      background: "rgba(255, 255, 255, 100)",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        type: "tween",
      },
    },
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
    <motion.header
      variants={variants}
      animate={yValue > 0 ? "scroll" : "normal"}
      className="fixed top-0 z-99 w-full px-10"
    >
      <motion.nav className="flex w-full items-center justify-between px-6 py-2 font-jakarta text-sm font-medium">
        <Image
          src="/images/logo/logo.png"
          alt="logo"
          width={230}
          height={100}
        />
        <ul className="flex items-center justify-between gap-x-2">
          {menus.map((item, index) => (
            <NavItem
              key={index}
              label={item.label}
              to={item.to}
              active={activeMenu}
              setHovered={setHovered}
              setActive={setActiveMenu}
            />
          ))}
          <div className="mx-3 h-4 rounded-full border-l-2 border-primary-500"></div>
          {isLogin && data ? (
            <UserDropdown
              onUserPage
              isOpen={open}
              setIsOpen={setOpen}
              image={data.image}
              username={data.username}
              email={data.email}
              editProfile
              accountSettings
            />
          ) : (
            <>
              <Button
                onClick={() => {
                  setIsRegister(true);
                  setBackdrop(true);
                }}
                size="sm"
                variant="outline"
              >
                Register
              </Button>
              <Button
                onClick={() => {
                  setIsRegister(false);
                  setBackdrop(true);
                }}
                size="sm"
              >
                Log In
              </Button>
            </>
          )}
        </ul>
      </motion.nav>
    </motion.header>
  );
};
