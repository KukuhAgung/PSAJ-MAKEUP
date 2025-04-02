"use client"
import React, { useState} from "react";
import { motion } from "framer-motion";

interface IProps {
  children: React.ReactNode;
  className?: string;
  onclick?: () => void
}

const AnimateButton: React.FC<IProps> = ({ children, className="relative", onclick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onclick?.()}
      className={`flex h-[48px] w-full max-w-[150px] items-center justify-center overflow-hidden rounded-full border border-primary-500 bg-primary-500 md:h-[48px] md:max-w-[188px] ${className}`}
    >
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isHovered ? -50 : 0 }}
        transition={{ type: "spring", duration: 0.5, ease: "easeInOut" }}
        className="absolute inset-0 flex h-full w-full items-center justify-center gap-x-3"
      >
        <p className="text-sm font-semibold tracking-[3%] text-white">
          {children || "Masukkan text"}
        </p>
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="#ffff"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.49984 19.5L19.4998 6.49996M19.4998 6.49996L10.8332 6.49996M19.4998 6.49996L19.4998 15.1666"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      <motion.div
        initial={{ y: 50 }}
        animate={{
          y: isHovered ? 0 : 50,
          width: isHovered ? 200 : 20,
          height: isHovered ? 200 : 20,
        }}
        transition={{ type: "spring", duration: 0.8, ease: "linear" }}
        className="absolute rounded-full bg-white"
      ></motion.div>
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: isHovered ? 0 : 50 }}
        transition={{ type: "spring", duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 flex h-full w-full items-center justify-center gap-x-3"
      >
        <p className="text-sm font-semibold tracking-[3%] text-primary-500">
          {children || "Masukkan text"}
        </p>
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="#894444"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.49984 19.5L19.4998 6.49996M19.4998 6.49996L10.8332 6.49996M19.4998 6.49996L19.4998 15.1666"
            stroke="#894444"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </button>
  );
};

export default AnimateButton;
