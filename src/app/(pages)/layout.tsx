"use client";
import { Navbar } from "@/components/templates/navbar";
import { useBackdrop } from "@/context/BackdropContext";
import { SignIn } from "@/components/templates/signin";
import { SignUp } from "@/components/templates/signup";
import { Footer } from "@/components/templates/footer";


export default function MainPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isRegister, backdrop } = useBackdrop();
  return (
    <>
      <Navbar />
      <main className="relative mx-10 my-[113px] flex flex-col gap-y-14">
        {children}
      </main>
      <Footer/>
      {isRegister && backdrop ? <SignUp /> : <SignIn />}
    </>
  );
}
