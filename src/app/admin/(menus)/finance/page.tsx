"use client"

import { useState, useEffect, useCallback } from "react"
import type React from "react"

import { utils, write } from "xlsx"
import { TotalIncomeWidget } from "./components/TotalIncomeWidget"
import { FilterWidget } from "./components/FilterWidget"
import { ImportWidget } from "./components/ImportWidget"
import { IncomeTable } from "./components/IncomeTable"
import { Notifications } from "./components/Notification"
import type { IncomeData, Notification } from "./types"
import { formatRupiah, getMonthName, getYear, getMonthNumber } from "./utils"

export default function IncomeDashboard() {
  // Inisialisasi newIncome dengan kategori default
  const [newIncome, setNewIncome] = useState<Omit<IncomeData, "id">>({
    date: new Date().toISOString().split("T")[0], // Set default to today
    category: "Jasa Make Up", // Set default category
    totalSales: 0,
    amount: 0,
    description: "",
  })
  const [incomeData, setIncomeData] = useState<IncomeData[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  // Tambahkan state isClearing
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const showNotification = useCallback((type: "success" | "error", title: string, message: string) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, type, title, message }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }, 5000)
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  // Update date when calendar selection changes
  useEffect(() => {
    if (selectedDate) {
      setNewIncome((prev) => ({
        ...prev,
        date: selectedDate.toISOString().split("T")[0],
      }))
    }
  }, [selectedDate])

  // API URL
  const API_URL = "/api/finance"

  // Perbaiki fungsi fetchIncomeData untuk memastikan filter berfungsi dengan benar
  const fetchIncomeData = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = API_URL;
      if (selectedMonth !== "all") {
        const monthNumber = getMonthNumber(selectedMonth);
        url += `?month=${monthNumber}&year=${selectedYear}`;
      }
  
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      
      // Validate response structure
      if (!result || typeof result !== 'object' || !result.data) {
        throw new Error('Invalid API response format');
      }
  
      // Use data directly from API without additional formatting
      setIncomeData(result.data);
      
    } catch (error) {
      console.error("Error fetching income data:", error);
      showNotification("error", "Error", "Failed to fetch income data");
      setIncomeData([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]); // Removed fetchIncomeData from dependencies

  // Pastikan useEffect dipanggil ketika filter berubah
  
  useEffect(() => {
    fetchIncomeData()
  }, [fetchIncomeData,selectedMonth, selectedYear])

  // Perbaiki fungsi handleAddIncome untuk menetapkan kategori default
  const handleAddIncome = async () => {
    setIsSubmitting(true)
    try {
      // Pastikan kategori selalu "Jasa Make Up"
      const dataToSubmit = {
        ...newIncome,
        category: "Jasa Make Up",
      }

      console.log("Submitting income data:", dataToSubmit)

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      })

      console.log("Response status:", response.status)

      // Log response text for debugging
      const responseText = await response.text()
      console.log("Response text:", responseText)

      // Parse the response text back to JSON
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Error parsing response:", parseError)
        showNotification("error", "Error", "Invalid response from server")
        return
      }

      if (result.code === 201) {
        showNotification("success", "Success", "Income data added successfully")

        // Reset form dan refresh data
        setNewIncome({
          date: new Date().toISOString().split("T")[0], // Reset to today
          category: "Jasa Make Up", // Tetapkan kategori default
          totalSales: 0,
          amount: 0,
          description: "",
        })
        setSelectedDate(new Date()) // Reset calendar to today
        fetchIncomeData()
      } else {
        showNotification("error", "Error", result.message || "Failed to add income data")
      }
    } catch (error) {
      console.error("Error adding income:", error)
      showNotification("error", "Error", "Failed to add income data")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fungsi untuk menghandle upload file Excel bulanan
  const handleMonthlyFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      showNotification("error", "Error", "No file selected")
      return
    }

    setIsSubmitting(true)
    try {
      console.log("Uploading file:", file.name)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      })

      console.log("Response status:", response.status)

      // Log response text for debugging
      const responseText = await response.text()
      console.log("Response text:", responseText)

      // Parse the response text back to JSON
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Error parsing response:", parseError)
        showNotification("error", "Error", "Invalid response from server")
        return
      }

      if (result.code === 201) {
        showNotification("success", "Success", "File imported successfully")
        fetchIncomeData()
      } else {
        showNotification("error", "Error", result.message || "Failed to import file")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      showNotification("error", "Error", "Failed to upload file")
    } finally {
      setIsSubmitting(false)
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

  // Tambahkan fungsi handleClearData setelah handleExportAllData
  // Fungsi untuk menghapus semua data
  const handleClearData = async () => {
    setIsClearing(true)
    try {
      const response = await fetch("/api/finance/clear", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()

      if (result.code === 200) {
        showNotification("success", "Success", "Semua data berhasil dihapus")
        // Refresh data
        setIncomeData([])
      } else {
        showNotification("error", "Error", result.message || "Gagal menghapus data")
      }
    } catch (error) {
      console.error("Error clearing data:", error)
      showNotification("error", "Error", "Gagal menghapus data")
    } finally {
      setIsClearing(false)
    }
  }

  // Filter data berdasarkan bulan dan tahun yang dipilih
  const filteredData = incomeData

  // Dapatkan daftar bulan unik dari data
  const uniqueMonths = Array.from(new Set(incomeData.map((income) => getMonthName(income.date))))

  // Dapatkan daftar tahun unik dari data
  const uniqueYears = Array.from(new Set(incomeData.map((income) => getYear(income.date))))

  return (
    <div className="container mx-auto py-8 w-full">
      <h1 className="text-3xl font-bold mb-6">Dashboard Pemasukan Bulanan</h1>

      <Notifications notifications={notifications} dismissNotification={dismissNotification} />

      {/* Widget Utama Berjejer 3 Kolom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
        {/* Total Pemasukan */}
        <TotalIncomeWidget incomeData={incomeData} />

        {/* Filter Data Bulanan */}
        <FilterWidget
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          uniqueMonths={uniqueMonths}
          uniqueYears={uniqueYears}
        />

        {/* Import Data */}
        <ImportWidget
          handleExportAllData={handleExportAllData}
          handleMonthlyFileUpload={handleMonthlyFileUpload}
          handleAddIncome={handleAddIncome}
          isSubmitting={isSubmitting}
          newIncome={newIncome}
          setNewIncome={setNewIncome}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          showNotification={showNotification}
          isClearing={isClearing}
          onClearData={handleClearData}
        />
      </div>

      {/* Tabel Full-Width */}
      <IncomeTable
        isLoading={isLoading}
        filteredData={filteredData}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        formatRupiah={formatRupiah}
        getMonthName={getMonthName}
        getYear={getYear}
      />
    </div>
  )
}

