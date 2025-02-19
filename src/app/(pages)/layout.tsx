import { Navbar } from "@/components/templates/navbar";

export default function MainPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-10">
      <header>
        <Navbar/>
      </header>

      <section>{children}</section>
    </main>
  );
}
