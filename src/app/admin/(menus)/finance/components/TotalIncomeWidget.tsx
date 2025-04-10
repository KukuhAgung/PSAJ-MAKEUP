"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { IncomeData } from "../types"

interface TotalIncomeWidgetProps {
  incomeData: IncomeData[]
}

// Fungsi untuk memformat angka menjadi format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Perbaiki perhitungan total
export function TotalIncomeWidget({ incomeData }: TotalIncomeWidgetProps) {
  // Hitung total amount dan totalSales
  const totalAmount = incomeData.reduce((sum, item) => sum + item.amount, 0)
  const totalSales = incomeData.reduce((sum, item) => sum + item.totalSales, 0)

  console.log(`Total amount: ${totalAmount}, Total sales: ${totalSales}`)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Pemasukan</CardTitle>
        <CardDescription>Total pemasukan dari semua kategori</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{formatRupiah(totalAmount)}</p>
        <p className="text-sm text-muted-foreground mt-2">Total Penjualan: {totalSales} item</p>
      </CardContent>
    </Card>
  )
}

