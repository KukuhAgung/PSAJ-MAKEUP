"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { scrollInfo } from "framer-motion";

export type menu = "Beranda" | "Produk" | "Galeri";

interface NavbarContextProps {
  yValue: number;
  setYValue: (value: number) => void;
  activeMenu: string;
  setActiveMenu: (menu: menu) => void;
}

const NavbarContext = createContext<NavbarContextProps | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const currentPath: menu = localStorage.getItem("storePath") as menu || "Beranda";
  const [activeMenu, setActiveMenu] = useState<menu>(currentPath);
  const [yValue, setYValue] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollInfo(({ y }) => {
      setYValue(y.current);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavbarContext.Provider
      value={{ activeMenu, setActiveMenu, yValue, setYValue }}
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
