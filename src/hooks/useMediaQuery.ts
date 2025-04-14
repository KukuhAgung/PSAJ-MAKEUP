import { useState, useEffect } from "react";

/**
 * Custom hook untuk mendeteksi media query.
 * @param query - Media query string (misalnya: "(max-width: 768px)").
 * @returns Boolean yang menunjukkan apakah media query cocok dengan kondisi saat ini.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Buat media query list berdasarkan query string
    const mediaQueryList = window.matchMedia(query);

    // Fungsi handler untuk memperbarui state ketika media query berubah
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches);
    };

    // Set nilai awal berdasarkan media query saat ini
    setMatches(mediaQueryList.matches);

    // Tambahkan event listener untuk mendeteksi perubahan media query
    mediaQueryList.addEventListener("change", handleChange);

    // Cleanup event listener saat komponen unmount
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [query]); // Jalankan ulang jika query berubah

  return matches;
}

export default useMediaQuery;
