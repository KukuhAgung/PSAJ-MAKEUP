"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { scrollInfo } from "framer-motion";
import { usePathname } from "next/navigation";

// Tipe untuk props context
interface NavbarContextProps {
  yValue: number;
  setYValue: (value: number) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  hovered: string | null;
  setHovered: (menu: string | null) => void;
}

const NavbarContext = createContext<NavbarContextProps | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const path = usePathname();
  const splitpath = path.split("/");
  const [activeMenu, setActiveMenu] = useState<string>(
    (typeof window !== "undefined" && localStorage.getItem("storePath")) ||
      "Beranda",
  );
  const [hovered, setHovered] = useState<string | null>(null);
  const [yValue, setYValue] = useState(0);

  // Scroll listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = scrollInfo(({ y }) => {
      setYValue(y.current);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Update active menu berdasarkan path
  useEffect(() => {
    if (typeof window !== "undefined") {
      switch (splitpath[1]) {
        case "product":
          localStorage.setItem("storePath", "Produk");
          setActiveMenu("Produk");
          break;
        case "gallery":
          localStorage.setItem("storePath", "Galeri");
          setActiveMenu("Galeri");
          break;
        default:
          localStorage.setItem("storePath", "Beranda");
          setActiveMenu("Beranda");
          break;
      }
    }
  }, [splitpath]);

  // Update active menu berdasarkan hover
  useEffect(() => {
    if (hovered === null) {
      setActiveMenu((localStorage.getItem("storePath") as string) || "Beranda");
    } else {
      setActiveMenu(hovered);
    }
  }, [hovered]);

  return (
    <NavbarContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        hovered,
        setHovered,
        yValue,
        setYValue,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};
