"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Calendar, Download, Loader2 } from "lucide-react"
import { ImportForm } from "./ImportForm"
import { ManualForm } from "./ManualForm"
import { ClearDataDialog } from "./ClearDataDialog"
import * as XLSX from "xlsx"

interface ImportWidgetProps {
  handleExportAllData: () => void
  handleMonthlyFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAddIncome: () => void
  isSubmitting: boolean
  newIncome: any
  setNewIncome: (income: any) => void
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  showNotification: (type: "success" | "error", title: string, message: string) => void
  isClearing: boolean
  onClearData: () => Promise<void>
}

export function ImportWidget({
  handleExportAllData,
  handleMonthlyFileUpload,
  handleAddIncome,
  isSubmitting,
  newIncome,
  setNewIncome,
  selectedDate,
  setSelectedDate,
  showNotification,
  isClearing,
  onClearData,
}: ImportWidgetProps) {
  const [isMonthlyImportDialogOpen, setIsMonthlyImportDialogOpen] = useState(false)
  const [isFileUploadTabActive, setIsFileUploadTabActive] = useState(true)
  const [showFormatGuide, setShowFormatGuide] = useState(false)

  const handleExportTemplate = () => {
    // Buat template dengan header dan contoh data yang konsisten
    const templateData = [
      {
        tanggal: "01/01/2024",
        bulan: "Januari",
        tahun: 2024,
        kategori: "Jasa Make Up",
        total_penjualan: 10,
        jumlah: 2000000,
        deskripsi: "Penjualan Jasa MakeUp bulan Januari",
      },
      {
        tanggal: "01/02/2024",
        bulan: "Februari",
        tahun: 2024,
        kategori: "Jasa Make Up",
        total_penjualan: 15,
        jumlah: 3000000,
        deskripsi: "Penjualan Jasa MakeUp bulan Februari",
      },
    ]

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(templateData)

    // Set column widths for better readability
    const columnWidths = [
      { wch: 12 }, // tanggal
      { wch: 10 }, // bulan
      { wch: 6 }, // tahun
      { wch: 15 }, // kategori
      { wch: 15 }, // total_penjualan
      { wch: 12 }, // jumlah
      { wch: 40 }, // deskripsi
    ]

    worksheet["!cols"] = columnWidths

    XLSX.utils.book_append_sheet(workbook, worksheet, "Template")

    // Write to file and download
    XLSX.writeFile(workbook, "template_import_pemasukan.xlsx")
  }

  return (
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

          {/* Button Clear All Data */}
          <ClearDataDialog onClearData={onClearData} isClearing={isClearing} />

          {/* Dialog Import Data */}
          <Dialog open={isMonthlyImportDialogOpen} onOpenChange={setIsMonthlyImportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" /> Import Data Bulanan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Import Data Pemasukan Bulanan</DialogTitle>
                <DialogDescription>Upload file Excel atau tambahkan data pemasukan secara manual.</DialogDescription>
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
                  className={`px-4 py-2 rounded-md ${!isFileUploadTabActive ? "bg-primary text-white" : "bg-muted"}`}
                  onClick={() => setIsFileUploadTabActive(false)}
                >
                  Input Manual
                </button>
              </div>
              {/* Konten Berdasarkan Tab */}
              {isFileUploadTabActive ? (
                <ImportForm
                  handleMonthlyFileUpload={handleMonthlyFileUpload}
                  isSubmitting={isSubmitting}
                  showFormatGuide={showFormatGuide}
                  setShowFormatGuide={setShowFormatGuide}
                  handleExportTemplate={handleExportTemplate}
                  showNotification={showNotification}
                />
              ) : (
                <ManualForm
                  newIncome={newIncome}
                  setNewIncome={setNewIncome}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  isSubmitting={isSubmitting}
                />
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsMonthlyImportDialogOpen(false)}
                  disabled={isSubmitting}
                  type="button"
                >
                  Batal
                </Button>
                {!isFileUploadTabActive && (
                  <Button type="submit" form="manual-income-form" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
                      </>
                    ) : (
                      "Simpan Data Manual"
                    )}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

