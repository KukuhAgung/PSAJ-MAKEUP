import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

// Buat instance Prisma dengan konfigurasi yang benar
// Gunakan PrismaClient sebagai singleton untuk menghindari terlalu banyak koneksi
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

export async function POST(request: Request) {
  console.log("POST request received for income data")

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

    // Cek apakah request adalah FormData atau JSON
    const contentType = request.headers.get("Content-Type") || ""
    console.log("Content-Type:", contentType)

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      console.log("Processing multipart/form-data request")
      const formData = await request.formData()
      const file = formData.get("file") as File | null

      if (!file) {
        console.log("No file provided in request")
        return NextResponse.json({ code: 400, message: "No file provided", data: null }, { status: 400 })
      }

      console.log("File received:", file.name, "Size:", file.size)
      const buffer = Buffer.from(await file.arrayBuffer())

      try {
        // Menggunakan XLSX untuk parsing Excel langsung, bukan CSV
        const workbook = XLSX.read(buffer, { type: "buffer" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const parsedData = XLSX.utils.sheet_to_json<ImportedData>(worksheet)

        console.log("Excel parsed successfully, rows:", parsedData.length)

        // Validasi data sebelum transformasi
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
          console.log("Invalid file format or empty file")
          return NextResponse.json(
            {
              code: 400,
              message: "Invalid file format or empty file",
              data: null,
            },
            { status: 400 },
          )
        }

        // Log sample data untuk debugging
        console.log("Sample data:", JSON.stringify(parsedData[0]))

        // Prevent duplicate data by checking existing entries
        // Get all dates in the system to check for duplicates
        const existingEntries = await prisma.income.findMany({
          select: {
            date: true,
            category: true,
            amount: true,
          },
        })

        // Create a Set of strings to easily check for duplicates
        const existingEntriesSet = new Set(
          existingEntries.map((entry) => `${entry.date.toISOString().split("T")[0]}-${entry.category}-${entry.amount}`),
        )

        const transformedData = parsedData.map((item: ImportedData) => {
          // Pastikan tanggal valid
          let dateValue: Date

          try {
            if (item.date) {
              // If the date is already a date string
              dateValue = new Date(item.date)
            } else if (item.tanggal) {
              // Handle different date formats
              if (typeof item.tanggal === "number") {
                // Excel serial date number
                dateValue = XLSX.SSF.parse_date_code(item.tanggal)
              } else if (item.tanggal.includes("/")) {
                // Handle DD/MM/YYYY format
                const parts = item.tanggal.split("/")
                if (parts.length === 3) {
                  const [day, month, year] = parts.map(Number)
                  dateValue = new Date(year, month - 1, day)
                } else {
                  dateValue = new Date(item.tanggal)
                }
              } else {
                dateValue = new Date(item.tanggal)
              }
            } else if (item.bulan && item.tahun) {
              // Jika hanya bulan dan tahun yang tersedia
              const monthNames = [
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
              const monthIndex = monthNames.indexOf(item.bulan)
              if (monthIndex !== -1) {
                dateValue = new Date(Number(item.tahun), monthIndex, 1)
              } else {
                dateValue = new Date()
              }
            } else {
              // Fallback ke tanggal saat ini
              dateValue = new Date()
            }

            // Validasi tanggal
            if (isNaN(dateValue.getTime())) {
              console.log("Invalid date, using current date as fallback")
              dateValue = new Date()
            }
          } catch (e) {
            console.log("Error parsing date:", e)
            dateValue = new Date()
          }

          // Pastikan kategori, totalSales, dan amount diproses dengan benar
          const category = String(item.category || item.kategori || "Jasa Make Up")
          const totalSales = Number(item.totalSales || item.total_penjualan || 0)
          const amount = Number(item.amount || item.jumlah || 0)
          const description = String(item.description || item.deskripsi || "")

          console.log("Transformed data:", {
            date: dateValue,
            category,
            totalSales,
            amount,
            description,
          })

          return {
            date: dateValue,
            category,
            totalSales,
            amount,
            description,
          }
        })

        // Filter out duplicates
        const uniqueData = transformedData.filter((entry) => {
          const entryKey = `${entry.date.toISOString().split("T")[0]}-${entry.category}-${entry.amount}`
          const isDuplicate = existingEntriesSet.has(entryKey)

          // If it's a duplicate, log it and filter it out
          if (isDuplicate) {
            console.log(`Skipping duplicate entry: ${entryKey}`)
            return false
          }

          // Add to set to prevent duplicates within the same import
          existingEntriesSet.add(entryKey)
          return true
        })

        console.log(`Filtered ${transformedData.length - uniqueData.length} duplicate records`)
        console.log(`Final unique data count: ${uniqueData.length}`)

        if (uniqueData.length === 0) {
          return NextResponse.json({
            code: 200,
            message: "No new data to import - all records already exist in the database",
            data: { count: 0 },
          })
        }

        console.log("Unique data to save:", uniqueData.length)
        console.log("First record to save:", JSON.stringify(uniqueData[0]))

        try {
          const createdIncomes = await prisma.income.createMany({
            data: uniqueData,
          })

          console.log("Data saved successfully:", createdIncomes)

          return NextResponse.json({
            code: 201,
            message: `Data imported successfully: ${createdIncomes.count} records created`,
            data: createdIncomes,
          })
        } catch (dbError) {
          console.error("Database error during createMany:", dbError)
          return NextResponse.json(
            {
              code: 500,
              message: "Failed to save data to database",
              error: String(dbError),
              data: null,
            },
            { status: 500 },
          )
        }
      } catch (excelError) {
        console.error("Excel parsing error:", excelError)
        return NextResponse.json(
          {
            code: 400,
            message: "Failed to parse Excel file. Please check the file format.",
            error: String(excelError),
            data: null,
          },
          { status: 400 },
        )
      }
    } else {
      // Handle JSON data
      console.log("Processing JSON request")
      let body
      try {
        body = await request.json()
        console.log("Request body parsed:", JSON.stringify(body))
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError)
        return NextResponse.json(
          {
            code: 400,
            message: "Invalid JSON data",
            error: String(jsonError),
            data: null,
          },
          { status: 400 },
        )
      }

      // Validasi data
      if (!body.date || !body.category) {
        console.log("Missing required fields:", { date: body.date, category: body.category })
        return NextResponse.json(
          {
            code: 400,
            message: "Date and category are required",
            data: null,
          },
          { status: 400 },
        )
      }

      try {
        console.log("Creating new income record with data:", {
          date: new Date(body.date),
          category: String(body.category),
          totalSales: Number(body.totalSales || 0),
          amount: Number(body.amount || 0),
          description: String(body.description || ""),
        })

        const newIncome = await prisma.income.create({
          data: {
            date: new Date(body.date),
            category: String(body.category),
            totalSales: Number(body.totalSales || 0),
            amount: Number(body.amount || 0),
            description: String(body.description || ""),
          },
        })

        console.log("Income record created successfully:", newIncome)

        return NextResponse.json({
          code: 201,
          message: "Income added successfully",
          data: newIncome,
        })
      } catch (dbError) {
        console.error("Database error during create:", dbError)
        return NextResponse.json(
          {
            code: 500,
            message: "Failed to add income to database",
            error: String(dbError),
            data: null,
          },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    console.error("Error in POST handler:", error)
    return NextResponse.json(
      { code: 500, message: "Internal Server Error", error: String(error), data: null },
      { status: 500 },
    )
  }
}

// GET endpoint stays the same
export async function GET(request: Request) {
  console.log("GET request received for income data")

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

    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    console.log("Query params:", { month, year })

    let whereClause = {}

    if (month && year) {
      // Konversi ke angka
      const monthNum = Number.parseInt(month, 10)
      const yearNum = Number.parseInt(year, 10)

      // Validasi input
      if (isNaN(monthNum) || isNaN(yearNum)) {
        return NextResponse.json(
          {
            code: 400,
            message: "Invalid month or year parameter",
            data: null,
          },
          { status: 400 },
        )
      }

      // Buat tanggal awal dan akhir bulan
      const startDate = new Date(yearNum, monthNum - 1, 1)
      const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999)

      whereClause = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      }

      console.log("Date filter:", {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    }

    try {
      console.log("Fetching income records with filter:", JSON.stringify(whereClause))
      const incomes = await prisma.income.findMany({
        where: whereClause,
        orderBy: {
          date: "desc",
        },
      })

      console.log(`Found ${incomes.length} income records`)

      return NextResponse.json({ code: 200, message: "Success", data: incomes })
    } catch (dbError) {
      console.error("Database error during findMany:", dbError)
      return NextResponse.json(
        {
          code: 500,
          message: "Failed to fetch income data from database",
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

