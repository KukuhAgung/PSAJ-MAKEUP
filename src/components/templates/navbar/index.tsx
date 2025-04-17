"use client";
import Image from "next/image";
import Button from "@/components/molecules/button/Button";
import { RxHamburgerMenu } from "react-icons/rx";
import { LiaTimesSolid } from "react-icons/lia";
import { motion, Variants } from "framer-motion";
import { useNavbar } from "@/context/NavbarContext";
import NavItem from "./component/NavItem";
import { useBackdrop } from "@/context/BackdropContext";
import { useApi } from "@/hooks/useFetchApi";
import { useEffect, useState } from "react";
import { IGetProfileResponseData } from "@/app/api/user-service/getProfile/index.model";
import { UserDropdown } from "../header/UserDropdown";
import { menus } from "./index.data";
import useMediaQuery from "@/hooks/useMediaQuery";
import { variantsNav } from "./index.variant";

export const Navbar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { trigger } = useApi("/api/user-service/getProfile");
  const { setBackdrop, setIsRegister } = useBackdrop();
  const { activeMenu, setActiveMenu, yValue, setHovered } = useNavbar();
  const [mobileNavbar, setMobileNavbar] = useState(false);
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
    trigger(
      {
        method: "GET",
      },
      {
        onSuccess: (res) => {
          setData(res.data);
          setIsLogin(true);
        },
        onError: (err) => {
          console.log(err);
        },
      },
    );
  }, [trigger]);

  useEffect(() => {
    if (mobileNavbar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileNavbar]);

  return (
    <motion.header
      variants={variants}
      animate={yValue > 0 ? "scroll" : "normal"}
      className="fixed top-0 z-99 w-full md:px-10"
    >
      <motion.nav className="flex w-full items-center justify-between px-6 py-2 font-jakarta text-sm font-medium">
        <Image
          src="/images/logo/logo.png"
          alt="logo"
          width={isMobile ? 200 : 230}
          height={isMobile ? 200 : 100}
        />
        {!isMobile && (
          <ul className="flex items-center justify-between gap-x-2">
            {menus.map((item, index) => (
              <NavItem
                key={index}
                label={item.label}
                to={item.to}
                mobile={false}
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
                id={data.id}
                email={data.email}
                editProfile
                inputReview
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
        )}

        {isMobile && (
          <motion.button
            variants={variantsNav}
            initial="initialButton"
            animate="visibleButton"
            transition={{
              duration: 0.5,
              delay: 0.5,
              ease: "easeInOut",
              type: "spring",
            }}
            onClick={() => setMobileNavbar(!mobileNavbar)}
          >
            <RxHamburgerMenu size={25} />
          </motion.button>
        )}

        {mobileNavbar && (
          <motion.div
            variants={variantsNav}
            initial="initial"
            animate={mobileNavbar ? "visible" : "hidden"}
            className="absolute left-0 top-0 z-50 flex min-h-screen max-h-[120vh] w-full flex-col items-center justify-center gap-y-2 bg-white px-6 py-2"
          >
            <div className="fixed top-10 flex w-full items-center justify-between px-6">
              <motion.button
                variants={variantsNav}
                initial="initialButton"
                animate="visibleButton"
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                  ease: "easeInOut",
                  type: "spring",
                }}
                onClick={() => setMobileNavbar(!mobileNavbar)}
              >
                <LiaTimesSolid size={25} />
              </motion.button>
              {isLogin && data ? (
                <div>
                  <UserDropdown
                    onUserPage
                    isOpen={open}
                    setIsOpen={setOpen}
                    image={data.image}
                    username={data.username}
                    id={data.id}
                    email={data.email}
                    editProfile
                    inputReview
                  />
                </div>
              ) : (
                <div className="flex items-center gap-x-4">
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
                </div>
              )}
            </div>
            <ul>
              {menus.map((item, index) => (
                <NavItem
                  key={index}
                  label={item.label}
                  to={item.to}
                  mobile
                  active={activeMenu}
                  setHovered={setHovered}
                  setActive={setActiveMenu}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </motion.nav>
    </motion.header>
  );
};
