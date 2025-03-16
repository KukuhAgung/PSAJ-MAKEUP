export type pages = "Beranda" | "Produk" | "Galeri";

interface IMenuItem {
  label: pages;
  to: string;
}

export const menus: IMenuItem[] = [
  {
    label: "Beranda",
    to: "/",
  },
  {
    label: "Produk",
    to: "/product",
  },
  {
    label: "Galeri",
    to: "/gallery",
  },
];
