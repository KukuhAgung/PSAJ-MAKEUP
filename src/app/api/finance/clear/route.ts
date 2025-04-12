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

export async function DELETE() {
  console.log("DELETE request received to clear all income data")

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

    try {
      // Hapus semua data income
      const result = await prisma.income.deleteMany({})
      console.log(`Deleted ${result.count} income records`)

      return NextResponse.json({
        code: 200,
        message: "All income data has been cleared successfully",
        data: { count: result.count },
      })
    } catch (dbError) {
      console.error("Database error during deleteMany:", dbError)
      return NextResponse.json(
        {
          code: 500,
          message: "Failed to clear income data from database",
          error: String(dbError),
          data: null,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in DELETE handler:", error)
    return NextResponse.json(
      { code: 500, message: "Internal Server Error", error: String(error), data: null },
      { status: 500 },
    )
  }
}

