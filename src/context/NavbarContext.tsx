"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { scrollInfo } from "framer-motion";
import { pages } from "@/components/templates/navbar/index.data";
import { usePathname } from "next/navigation";

interface NavbarContextProps {
  yValue: number;
  setYValue: (value: number) => void;
  activeMenu: string;
  setActiveMenu: (menu: pages) => void;
  hovered: string | null;
  setHovered: (menu: pages | null) => void;
}

const NavbarContext = createContext<NavbarContextProps | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const path = usePathname();
  const splitpath = path.split("/");
  const currentPath: pages =
    (localStorage.getItem("storePath") as pages) || "Beranda";
  const [activeMenu, setActiveMenu] = useState<pages>(currentPath);
  const [hovered, setHovered] = useState<pages | null>(null);
  const [yValue, setYValue] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollInfo(({ y }) => {
      setYValue(y.current);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (hovered === null) {
      setActiveMenu(currentPath);
    } else {
      setActiveMenu(hovered);
    }
  }, [currentPath,hovered]);

  useEffect(() => {  
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
  }, [splitpath,path])

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
