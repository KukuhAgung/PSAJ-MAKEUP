// Fungsi untuk memformat angka menjadi format Rupiah
export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Fungsi untuk mendapatkan nama bulan dari tanggal
export const getMonthName = (date: string) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]
  const monthIndex = new Date(date).getMonth()
  return months[monthIndex]
}

// Fungsi untuk mendapatkan tahun dari tanggal
export const getYear = (date: string) => {
  return new Date(date).getFullYear()
}

// Fungsi untuk mengkonversi nama bulan ke nomor bulan
export const getMonthNumber = (monthName: string) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]
  return months.indexOf(monthName) + 1
}

