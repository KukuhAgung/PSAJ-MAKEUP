"use client";
import { BackdropProvider } from "@/context/BackdropContext";
import { NavbarProvider } from "@/context/NavbarContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider } from "next-auth/react";

const CustomProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider>
        <BackdropProvider>
          <NavbarProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </NavbarProvider>
        </BackdropProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default CustomProvider;
