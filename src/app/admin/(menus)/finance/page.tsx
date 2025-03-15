"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { read, utils, write } from "xlsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Calendar } from "lucide-react"

// Tipe data untuk pemasukan
interface IncomeData {
  id: string
  date: string
  category: string
  totalSales: number // Kolom baru untuk total penjualan
  amount: number
  description: string
}

// Tipe data untuk ringkasan bulanan
interface MonthlySummary {
  month: string
  year: number
  total: number
  totalSales: number // Menambahkan total penjualan ke ringkasan
  categories: {
    [key: string]: number
  }
}

// Tipe data untuk JSON yang diimpor dari Excel
interface ImportedData {
  bulan?: string
  tahun?: number
  tanggal?: string
  date?: string
  kategori?: string
  category?: string
  total_penjualan?: number
  totalSales?: number
  jumlah?: number
  amount?: number
  deskripsi?: string
  description?: string
}

const dummyData: IncomeData[] = [
  {
    id: "1",
    date: "2024-01-05",
    category: "Penjualan Jasa",
    totalSales: 25, // Jumlah penjualan
    amount: 5000000,
    description: "Penjualan Jasa MakeUp bulan Januari",
  },
  {
    id: "2",
    date: "2024-02-10",
    category: "Penjualan Jasa",
    totalSales: 31, // Jumlah penjualan
    amount: 6200000,
    description: "Penjualan Jasa MakeUp bulan Februari",
  },
  {
    id: "3",
    date: "2025-03-15",
    category: "Penjualan Jasa",
    totalSales: 29, // Jumlah penjualan
    amount: 5800000,
    description: "Penjualan Jasa MakeUp bulan Maret",
  },
  {
    id: "4",
    date: "2023-04-20",
    category: "Penjualan Jasa",
    totalSales: 22, // Jumlah penjualan
    amount: 4500000,
    description: "Penjualan jasa MakeUp bulan April",
  },
  {
    id: "5",
    date: "2023-05-25",
    category: "Penjualan Jasa",
    totalSales: 36, // Jumlah penjualan
    amount: 7200000,
    description: "Penjualan jasa MakeUp bulan Mei",
  },
  {
    id: "6",
    date: "2023-06-30",
    category: "Penjualan Jasa",
    totalSales: 19, // Jumlah penjualan
    amount: 3800000,
    description: "Penjualan jasa MakeUp bulan Juni",
  },
]

// Fungsi untuk memformat angka menjadi format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Fungsi untuk mendapatkan nama bulan dari tanggal
const getMonthName = (date: string) => {
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
const getYear = (date: string) => {
  return new Date(date).getFullYear()
}

// Fungsi untuk mengkonversi nama bulan ke nomor bulan
const getMonthNumber = (monthName: string) => {
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

export default function IncomeDashboard() {
  const [incomeData, setIncomeData] = useState<IncomeData[]>(dummyData)
  const [isFileUploadTabActive, setIsFileUploadTabActive] = useState(true)
  const [newIncome, setNewIncome] = useState<Omit<IncomeData, "id">>({
    date: "",
    category: "",
    totalSales: 0, // Menambahkan total penjualan ke state
    amount: 0,
    description: "",
  })
  const [isMonthlyImportDialogOpen, setIsMonthlyImportDialogOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  // Fungsi untuk menghitung ringkasan bulanan
  const calculateMonthlySummaries = () => {
    const summaries: { [key: string]: MonthlySummary } = {}
    incomeData.forEach((income) => {
      const date = new Date(income.date)
      const month = getMonthName(income.date)
      const year = date.getFullYear()
      const key = `${month}-${year}`
      if (!summaries[key]) {
        summaries[key] = {
          month,
          year,
          total: 0,
          totalSales: 0, // Inisialisasi total penjualan
          categories: {},
        }
      }
      summaries[key].total += income.amount
      summaries[key].totalSales += income.totalSales // Menambahkan total penjualan
      if (!summaries[key].categories[income.category]) {
        summaries[key].categories[income.category] = 0
      }
      summaries[key].categories[income.category] += income.amount
    })
    // Hapus penggunaan monthlySummaries jika tidak digunakan
    // setMonthlySummaries(
    //   Object.values(summaries).sort((a, b) => {
    //     if (a.year !== b.year) return a.year - b.year
    //     return getMonthNumber(a.month) - getMonthNumber(b.month)
    //   }),
    // )
  }

  // Menghitung ringkasan bulanan saat data berubah
  useEffect(() => {
    calculateMonthlySummaries()
  }, [incomeData, calculateMonthlySummaries])

  // Fungsi untuk menambahkan data pemasukan baru
  const handleAddIncome = () => {
    const newIncomeWithId: IncomeData = {
      ...newIncome,
      id: (incomeData.length + 1).toString(),
    }
    setIncomeData((prevIncomeData) => [...prevIncomeData, newIncomeWithId])
    setNewIncome({
      date: "",
      category: "",
      totalSales: 0,
      amount: 0,
      description: "",
    })
    setIsMonthlyImportDialogOpen(false) // Tutup dialog import setelah menambahkan data
  }

  // Fungsi untuk menghandle perubahan pada form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewIncome({
      ...newIncome,
      [name]: name === "amount" || name === "totalSales" ? Number.parseFloat(value) : value,
    })
  }

  // Fungsi untuk menghandle upload file Excel bulanan
  const handleMonthlyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = read(data, { type: "array" })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = utils.sheet_to_json<ImportedData>(firstSheet)
        const transformedData: IncomeData[] = jsonData.map((item: ImportedData, index: number) => {
          let date = ""
          if (item.bulan && item.tahun) {
            const monthIndex = getMonthNumber(item.bulan) - 1
            date = new Date(item.tahun, monthIndex, 15).toISOString().split("T")[0]
          } else {
            date = item.date || item.tanggal || ""
          }
          return {
            id: (incomeData.length + index + 1).toString(),
            date: date,
            category: item.category || item.kategori || "",
            totalSales: Number(item.total_penjualan || item.totalSales || 0),
            amount: Number(item.amount || item.jumlah || 0),
            description: item.description || item.deskripsi || "",
          }
        })
        setIncomeData((prevIncomeData) => [...prevIncomeData, ...transformedData])
        setIsMonthlyImportDialogOpen(false)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  // Fungsi untuk mengekspor semua data ke Excel
  const handleExportAllData = () => {
    // Transformasi data untuk ekspor
    const exportData = incomeData.map((item) => ({
      tanggal: new Date(item.date).toLocaleDateString("id-ID"),
      bulan: getMonthName(item.date),
      tahun: getYear(item.date),
      kategori: item.category,
      total_penjualan: item.totalSales,
      jumlah: item.amount,
      deskripsi: item.description,
    }))
    const worksheet = utils.json_to_sheet(exportData)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, "Data Pemasukan")
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data_pemasukan_lengkap.xlsx"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter data berdasarkan bulan dan tahun yang dipilih
  const filteredData = incomeData.filter((income) => {
    if (selectedMonth === "all") return true
    const incomeMonth = getMonthName(income.date)
    const incomeYear = getYear(income.date)
    return incomeMonth === selectedMonth && incomeYear === selectedYear
  })

  // Dapatkan daftar bulan unik dari data
  const uniqueMonths = Array.from(new Set(incomeData.map((income) => getMonthName(income.date))))

  // Dapatkan daftar tahun unik dari data
  const uniqueYears = Array.from(new Set(incomeData.map((income) => getYear(income.date))))

  return (
    <div className="container mx-auto py-8 w-full">
      <h1 className="text-3xl font-bold mb-6">Dashboard Pemasukan Bulanan</h1>
      {/* Widget Utama Berjejer 3 Kolom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
        {/* Total Pemasukan */}
        <Card>
          <CardHeader>
            <CardTitle>Total Pemasukan</CardTitle>
            <CardDescription>Total pemasukan dari semua kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatRupiah(filteredData.reduce((sum, item) => sum + item.amount, 0))}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Total Penjualan: {filteredData.reduce((sum, item) => sum + item.totalSales, 0)} item
            </p>
          </CardContent>
        </Card>
        {/* Filter Data Bulanan */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Data Bulanan</CardTitle>
            <CardDescription>Pilih bulan dan tahun untuk melihat data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="month-select" className="block mb-2">
                  Bulan
                </Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="month-select">
                    <SelectValue placeholder="Pilih Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Bulan</SelectItem>
                    {uniqueMonths.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year-select" className="block mb-2">
                  Tahun
                </Label>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
                >
                  <SelectTrigger id="year-select">
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Import Data Bulanan</CardTitle>
            <CardDescription>Upload data pemasukan bulanan atau tambahkan data manual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Button Export All Data */}
              <Button variant="outline" onClick={handleExportAllData} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Export Semua Data
              </Button>
              {/* Dialog Import Data */}
              <Dialog open={isMonthlyImportDialogOpen} onOpenChange={setIsMonthlyImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Calendar className="mr-2 h-4 w-4" /> Import Data Bulanan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Data Pemasukan Bulanan</DialogTitle>
                    <DialogDescription>
                      Upload file Excel atau tambahkan data pemasukan secara manual.
                    </DialogDescription>
                  </DialogHeader>
                  {/* Tabs: File Upload dan Input Manual */}
                  <div className="flex justify-center space-x-4 mb-4">
                    <button
                      className={`px-4 py-2 rounded-md ${isFileUploadTabActive ? "bg-primary text-white" : "bg-muted"}`}
                      onClick={() => setIsFileUploadTabActive(true)}
                    >
                      Upload File
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ${
                        !isFileUploadTabActive ? "bg-primary text-white" : "bg-muted"
                      }`}
                      onClick={() => setIsFileUploadTabActive(false)}
                    >
                      Input Manual
                    </button>
                  </div>
                  {/* Konten Berdasarkan Tab */}
                  {isFileUploadTabActive ? (
                    <div className="grid gap-4 py-4">
                      <Label htmlFor="monthly-file-upload">File Excel</Label>
                      <Input
                        id="monthly-file-upload"
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleMonthlyFileUpload}
                      />
                      <p className="text-sm text-muted-foreground">
                        Pastikan format file sesuai dengan template yang disediakan.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date" className="block mb-2">
                            Tanggal
                          </Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={newIncome.date}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category" className="block mb-2">
                            Kategori
                          </Label>
                          <Input
                            id="category"
                            name="category"
                            value={newIncome.category}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor="totalSales" className="block mb-2">
                            Total Penjualan
                          </Label>
                          <Input
                            id="totalSales"
                            name="totalSales"
                            type="number"
                            value={newIncome.totalSales || ""}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor="amount" className="block mb-2">
                            Jumlah
                          </Label>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            value={newIncome.amount || ""}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="description" className="block mb-2">
                            Deskripsi
                          </Label>
                          <Input
                            id="description"
                            name="description"
                            value={newIncome.description}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsMonthlyImportDialogOpen(false)}>
                      Batal
                    </Button>
                    {!isFileUploadTabActive && <Button onClick={handleAddIncome}>Simpan Data Manual</Button>}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Tabel Full-Width */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Data Pemasukan Bulanan</CardTitle>
          <CardDescription>
            {selectedMonth === "all"
              ? "Menampilkan semua data pemasukan"
              : `Menampilkan data pemasukan bulan ${selectedMonth} ${selectedYear}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto w-full">
            <Table>
              <TableCaption>
                {selectedMonth === "all"
                  ? "Daftar semua pemasukan"
                  : `Daftar pemasukan bulan ${selectedMonth} ${selectedYear}`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Bulan</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-center">Total Penjualan</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead>Deskripsi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell>{new Date(income.date).toLocaleDateString("id-ID")}</TableCell>
                      <TableCell>{getMonthName(income.date)}</TableCell>
                      <TableCell>{getYear(income.date)}</TableCell>
                      <TableCell>{income.category}</TableCell>
                      <TableCell className="text-center">{income.totalSales} item</TableCell>
                      <TableCell className="text-right">{formatRupiah(income.amount)}</TableCell>
                      <TableCell>{income.description}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Tidak ada data untuk periode yang dipilih
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}