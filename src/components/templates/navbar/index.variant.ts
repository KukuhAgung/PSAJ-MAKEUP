import { Variants } from "framer-motion";

export const variantsNav: Variants = {
  initialButton: {
    opacity: 0,
    scale: 0,
  },
  visibleButton: {
    opacity: 1,
    scale: 1,
  },
  initial: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  hidden: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};
