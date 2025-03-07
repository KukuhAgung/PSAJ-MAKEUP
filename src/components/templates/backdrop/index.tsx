import { useBackdrop } from "@/context/BackdropContext";
import { motion, Variants } from "framer-motion";

interface BackdropProps {
  children: React.ReactNode;
}

export const Backdrop: React.FC<BackdropProps> = ({ children }) => {
  const { backdrop } = useBackdrop();

  const variants: Variants = {
    open: {
      zIndex: 10000,
      position: "fixed",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      inset: 0,
      background: "rgba(0, 0, 0, 0.5)",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    closed: {
      display: "none",
      background: "rgba(0, 0, 0, 0)",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.article variants={variants} initial="closed" animate={backdrop ? "open" : "closed"} exit="closed" className="bg-black">
      {children}
    </motion.article>
  );
};
