/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

// Buat instance Prisma dengan konfigurasi yang benar
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })
} else {
  // Hindari multiple instances selama development
  if (!(global as any).prisma) {
    ;(global as any).prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    })
  }
  prisma = (global as any).prisma
}

export async function GET() {
  console.log("GET request received for income summary data")

  try {
    // Verifikasi koneksi database terlebih dahulu
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

    // Get current date info
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Calculate previous month
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Create date ranges for current and previous months
    const currentMonthStart = new Date(currentYear, currentMonth, 1)
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999)

    const previousMonthStart = new Date(previousYear, previousMonth, 1)
    const previousMonthEnd = new Date(previousYear, previousMonth + 1, 0, 23, 59, 59, 999)

    try {
      // Get total sales data
      const totalData = await prisma.income.aggregate({
        _sum: {
          amount: true,
          totalSales: true,
        },
      })

      // Get current month data
      const currentMonthData = await prisma.income.aggregate({
        _sum: {
          amount: true,
          totalSales: true,
        },
        where: {
          date: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
        },
      })

      // Get previous month data
      const previousMonthData = await prisma.income.aggregate({
        _sum: {
          amount: true,
          totalSales: true,
        },
        where: {
          date: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
      })

      // Calculate percentage changes
      const currentMonthAmount = currentMonthData._sum.amount || 0
      const previousMonthAmount = previousMonthData._sum.amount || 0

      let percentageChange = 0
      if (previousMonthAmount > 0) {
        percentageChange = ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100
      } else if (currentMonthAmount > 0) {
        percentageChange = 100
      }

      const summary = {
        totalAmount: totalData._sum.amount || 0,
        totalSales: totalData._sum.totalSales || 0,
        currentMonth: {
          amount: currentMonthAmount,
          sales: currentMonthData._sum.totalSales || 0,
        },
        previousMonth: {
          amount: previousMonthAmount,
          sales: previousMonthData._sum.totalSales || 0,
        },
        percentageChange: Number.parseFloat(percentageChange.toFixed(2)),
      }

      return NextResponse.json({
        code: 200,
        message: "Success",
        data: summary,
      })
    } catch (dbError) {
      console.error("Database error during aggregation:", dbError)
      return NextResponse.json(
        {
          code: 500,
          message: "Failed to fetch summary data from database",
          error: String(dbError),
          data: null,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in GET handler:", error)
    return NextResponse.json(
      { code: 500, message: "Internal Server Error", error: String(error), data: null },
      { status: 500 },
    )
  }
}

