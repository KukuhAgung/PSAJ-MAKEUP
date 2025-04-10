"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import type { IncomeData } from "../types"

interface IncomeTableProps {
  isLoading: boolean
  filteredData: IncomeData[]
  selectedMonth: string
  selectedYear: number
  formatRupiah: (amount: number) => string
  getMonthName: (date: string) => string
  getYear: (date: string) => number
}

export function IncomeTable({
  isLoading,
  filteredData,
  selectedMonth,
  selectedYear,
  formatRupiah,
  getMonthName,
  getYear,
}: IncomeTableProps) {
  return (
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
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Memuat data...</span>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}

