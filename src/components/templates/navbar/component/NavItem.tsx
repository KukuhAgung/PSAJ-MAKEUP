"use client";
import { motion } from "framer-motion";
import { menu } from "@/context/NavbarContext";
import Link from "next/link";

interface NavItemProps {
  label: menu;
  to: string;
  active: string;
  setActive: (menu: menu) => void;
}

const NavItem = ({ label, to, active, setActive }: NavItemProps) => {
  return (
    <li className="relative flex cursor-pointer items-center justify-center gap-x-2">
      <Link
        href={to}
        onClick={() => {
          localStorage.setItem("storePath", label);
          setActive(label);
        }}
        className="flex h-[38px] w-[84px] items-center justify-center text-primary-500 text-base"
      >
        {label}
      </Link>
      {label === active && (
        <motion.div
          layoutId="nav-item"
          initial={{ position: "absolute" }}
          transition={{
            type: "tween",
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="h-full w-full rounded-3xl border-2 border-primary-500"
        ></motion.div>
      )}
    </li>
  );
};

export default NavItem;
