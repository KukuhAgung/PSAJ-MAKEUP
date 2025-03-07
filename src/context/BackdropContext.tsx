"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface BackdropContextProps {
  isRegister: boolean;
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
  backdrop: boolean;
  setBackdrop: React.Dispatch<React.SetStateAction<boolean>>;
}

const BackdropContext = createContext<BackdropContextProps | undefined>(
  undefined,
);

export const BackdropProvider = ({ children }: { children: ReactNode }) => {
  const [backdrop, setBackdrop] = useState<boolean>(false);
  const [isRegister, setIsRegister] = useState<boolean>(false);

  return (
    <BackdropContext.Provider value={{ backdrop, setBackdrop, isRegister, setIsRegister }}>
      {children}
    </BackdropContext.Provider>
  );
};

export const useBackdrop = () => {
    const context = useContext(BackdropContext);
    if (!context) { 
        throw new Error("useBackdrop must be used within a BackdropProvider")
    }
    return context
}
