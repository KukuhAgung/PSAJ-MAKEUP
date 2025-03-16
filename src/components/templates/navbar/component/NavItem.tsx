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
}

const NavItem = ({
  label,
  to,
  active,
  setActive,
  setHovered,
}: NavItemProps) => {
  return (
    <motion.li
      onHoverStart={() => setHovered(label)}
      onHoverEnd={() => setHovered(null)}
      className="relative flex cursor-pointer items-center justify-center gap-x-2"
    >
      <Link
        href={to}
        onClick={() => {
          localStorage.setItem("storePath", label);
          setActive(label);
        }}
        className="flex h-[38px] w-[84px] items-center justify-center text-base text-primary-500"
      >
        {label}
      </Link>
      {label === active && (
        <motion.div
          layoutId="nav-item"
          initial={{ position: "absolute", zIndex: -10 }}
          transition={{
            type: "tween",
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="h-full w-full rounded-3xl border-2 border-primary-500"
        ></motion.div>
      )}
    </motion.li>
  );
};

export default NavItem;
