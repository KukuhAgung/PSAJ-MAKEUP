"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileDown, HelpCircle, Loader2 } from "lucide-react"

interface ImportFormProps {
  handleMonthlyFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  isSubmitting: boolean
  showFormatGuide: boolean
  setShowFormatGuide: (show: boolean) => void
  handleExportTemplate: () => void
  showNotification: (type: "success" | "error", title: string, message: string) => void
}

export function ImportForm({
  handleMonthlyFileUpload,
  isSubmitting,
  showFormatGuide,
  setShowFormatGuide,
  handleExportTemplate,
  showNotification,
}: ImportFormProps) {
  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Format Excel</h3>
          <Button variant="outline" size="sm" onClick={() => setShowFormatGuide(!showFormatGuide)} className="mb-2">
            {showFormatGuide ? "Sembunyikan Format" : "Lihat Format"}
            <HelpCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {showFormatGuide && (
          <div className="border rounded-md p-4 mb-4 bg-muted/50">
            <h4 className="font-medium mb-2">Format Kolom Excel yang Diharapkan:</h4>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>tanggal</TableHead>
                    <TableHead>bulan</TableHead>
                    <TableHead>tahun</TableHead>
                    <TableHead>kategori</TableHead>
                    <TableHead>total_penjualan</TableHead>
                    <TableHead>jumlah</TableHead>
                    <TableHead>deskripsi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>01/01/2024</TableCell>
                    <TableCell>Januari</TableCell>
                    <TableCell>2024</TableCell>
                    <TableCell>Penjualan Jasa</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>2000000</TableCell>
                    <TableCell>Penjualan Jasa MakeUp bulan Januari</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>01/02/2024</TableCell>
                    <TableCell>Februari</TableCell>
                    <TableCell>2024</TableCell>
                    <TableCell>Penjualan Jasa</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>3000000</TableCell>
                    <TableCell>Penjualan Jasa MakeUp bulan Februari</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Penting:</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>
                  Pastikan nama kolom <strong>persis</strong> seperti format di atas
                </li>
                <li>Tanggal bisa dalam format DD/MM/YYYY atau format tanggal Excel</li>
                <li>Kolom bulan dan tahun opsional jika tanggal sudah diisi</li>
                <li>Kolom kategori wajib diisi</li>
                <li>Kolom total_penjualan dan jumlah harus berupa angka</li>
                <li>Sistem akan mencegah data duplikat saat mengimpor</li>
              </ul>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={handleExportTemplate}>
                <FileDown className="mr-2 h-4 w-4" />
                Download Template Excel
              </Button>
            </div>
          </div>
        )}
      </div>

      <form
        className="grid gap-4 py-4"
        onSubmit={(e) => {
          e.preventDefault()
          const fileInput = document.getElementById("monthly-file-upload") as HTMLInputElement
          if (fileInput?.files?.[0]) {
            handleMonthlyFileUpload({
              target: { files: fileInput.files },
            } as React.ChangeEvent<HTMLInputElement>)
          } else {
            showNotification("error", "Error", "Silakan pilih file terlebih dahulu")
          }
        }}
      >
        <Label htmlFor="monthly-file-upload" className="block mb-2">
          File Excel
        </Label>
        <Input id="monthly-file-upload" type="file" accept=".xlsx, .xls" disabled={isSubmitting} />
        <p className="text-sm text-muted-foreground">
          Pastikan format file sesuai dengan template yang disediakan. Data duplikat akan diabaikan.
        </p>
        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengimpor...
            </>
          ) : (
            "Import File"
          )}
        </Button>
      </form>
    </div>
  )
}

