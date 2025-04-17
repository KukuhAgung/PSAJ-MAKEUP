"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { pages } from "../index.data";

interface NavItemProps {
  label: pages;
  to: string;
  active: string;
  setHovered: (menu: pages | null) => void;
  setActive: (menu: pages) => void;
  mobile: boolean;
}

const NavItem = ({
  label,
  to,
  active,
  setActive,
  setHovered,
  mobile,
}: NavItemProps) => {
  return (
    <motion.li
      onHoverStart={() => setHovered(label)}
      onHoverEnd={() => setHovered(null)}
      className={`relative ${mobile && "gap-y-4"} flex cursor-pointer items-center justify-center`}
    >
      <Link
        href={to}
        onClick={() => {
          if (typeof window !== "undefined") {
            localStorage.setItem("storePath", label);
          }
          setActive(label);
        }}
        className="mb-6 flex h-full w-full items-center justify-center gap-x-2 text-center text-2xl text-primary-500 md:mb-0 md:h-[38px] md:w-[84px] md:text-left md:text-base"
      >
        {label}
      </Link>
      {!mobile && label === active ? (
        <motion.div
          layoutId="nav-item"
          initial={false}
          style={{ position: "absolute", zIndex: -10 }}
          transition={{
            type: "tween",
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="h-full w-full rounded-3xl border-2 border-primary-500"
        ></motion.div>
      ) : null}
    </motion.li>
  );
};

export default NavItem;
