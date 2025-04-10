import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

// Endpoint untuk menguji koneksi database dan operasi dasar
export async function GET(request: Request) {
  console.log("Test DB endpoint called")

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })

  try {
    console.log("Testing database connection...")

    // Test 1: Koneksi dasar
    try {
      await prisma.$queryRaw`SELECT 1 as test`
      console.log("Basic connection test: SUCCESS")
    } catch (error) {
      console.error("Basic connection test: FAILED", error)
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed",
          error: String(error),
          step: "basic_connection",
        },
        { status: 500 },
      )
    }

    // Test 2: Cek skema
    try {
      // Coba buat record test
      const testRecord = await prisma.income.create({
        data: {
          date: new Date(),
          category: "TEST",
          totalSales: 1,
          amount: 1000,
          description: "Test record - will be deleted",
        },
      })
      console.log("Schema test (create): SUCCESS", testRecord)

      // Hapus record test
      await prisma.income.delete({
        where: { id: testRecord.id },
      })
      console.log("Schema test (delete): SUCCESS")
    } catch (error) {
      console.error("Schema test: FAILED", error)
      return NextResponse.json(
        {
          status: "error",
          message: "Schema test failed",
          error: String(error),
          step: "schema_test",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "success",
      message: "All database tests passed",
      databaseUrl: process.env.DATABASE_URL ? "Configured" : "Not configured",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test DB endpoint error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Test failed",
        error: String(error),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

