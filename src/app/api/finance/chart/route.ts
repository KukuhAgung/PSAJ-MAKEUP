// /app/api/income/chart/route.ts
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

// Gunakan singleton pattern untuk PrismaClient
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })
} else {
  if (!(global as any).prisma) {
    ;(global as any).prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    })
  }
  prisma = (global as any).prisma
}

// Fungsi untuk mendapatkan data tahun saat ini atau tahun yang diminta
export async function GET(request: Request) {
  try {
    // Verifikasi koneksi database
    try {
      console.log("Testing database connection...")
      await prisma.$queryRaw`SELECT 1`
      console.log("Database connection successful")
    } catch (dbConnError) {
      console.error("Database connection error:", dbConnError)
      return NextResponse.json(
        {
          code: 500,
          message: "Database connection failed",
          error: String(dbConnError),
          data: null,
        },
        { status: 500 },
      )
    }

    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get("year")
    
    // Gunakan tahun saat ini jika tidak ada parameter
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear()
    
    console.log(`Fetching chart data for year: ${year}`)

    // Mengambil data untuk setiap bulan dalam tahun tersebut
    const monthlyData = []
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1)
      const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999)
      
      // Query untuk mendapatkan total penjualan dan pendapatan per bulan
      const monthData = await prisma.$queryRaw`
        SELECT 
          SUM(CAST("totalSales" AS FLOAT)) as "totalSales",
          SUM("amount") as "totalAmount"
        FROM "Income"
        WHERE "date" >= ${startDate} AND "date" <= ${endDate}
      `
      
      // Ambil hasil query (array dengan satu objek)
      const result = monthData as any
      
      // Tambahkan data bulan ke array
      monthlyData.push({
        month: month + 1,
        totalSales: result[0]?.totalSales || 0,
        totalAmount: result[0]?.totalAmount || 0
      })
    }
    
    // Kelompokkan data untuk format yang dibutuhkan oleh chart
    const formattedData = {
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      totalSales: monthlyData.map(item => Math.round(item.totalSales)),
      totalAmount: monthlyData.map(item => Math.round(item.totalAmount))
    }
    
    return NextResponse.json({ 
      code: 200, 
      message: "Success", 
      data: formattedData
    })
  } catch (error) {
    console.error("Error in GET handler:", error)
    return NextResponse.json(
      { code: 500, message: "Internal Server Error", error: String(error), data: null },
      { status: 500 },
    )
  }
}