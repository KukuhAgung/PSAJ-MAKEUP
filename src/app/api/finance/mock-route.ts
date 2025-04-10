import { NextResponse } from "next/server"

// Data mock untuk testing
const mockIncomeData = [
  {
    id: "1",
    date: new Date("2024-01-01"),
    category: "Penjualan Jasa",
    totalSales: 10,
    amount: 2000000,
    description: "Penjualan Jasa MakeUp bulan Januari",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    date: new Date("2024-02-01"),
    category: "Penjualan Jasa",
    totalSales: 15,
    amount: 3000000,
    description: "Penjualan Jasa MakeUp bulan Februari",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    date: new Date("2024-03-01"),
    category: "Penjualan Produk",
    totalSales: 5,
    amount: 1500000,
    description: "Penjualan Produk MakeUp bulan Maret",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// GET endpoint yang mengembalikan data mock
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    let filteredData = [...mockIncomeData]

    if (month && year) {
      const monthNum = Number.parseInt(month)
      const yearNum = Number.parseInt(year)

      filteredData = mockIncomeData.filter((income) => {
        const incomeDate = new Date(income.date)
        return incomeDate.getMonth() + 1 === monthNum && incomeDate.getFullYear() === yearNum
      })
    }

    return NextResponse.json({
      code: 200,
      message: "Success (MOCK DATA)",
      data: filteredData,
    })
  } catch (error) {
    console.error("Error in mock GET handler:", error)
    return NextResponse.json(
      { code: 500, message: "Internal Server Error", error: String(error), data: null },
      { status: 500 },
    )
  }
}

// POST endpoint yang mengembalikan respons sukses palsu
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("Content-Type") || ""

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await request.formData()
      const file = formData.get("file") as File | null

      if (!file) {
        return NextResponse.json({ code: 400, message: "No file provided", data: null }, { status: 400 })
      }

      return NextResponse.json({
        code: 201,
        message: "File imported successfully (MOCK)",
        data: { count: 5 }, // Seolah-olah 5 record telah dibuat
      })
    } else {
      // Handle JSON data
      const body = await request.json()

      return NextResponse.json({
        code: 201,
        message: "Income added successfully (MOCK)",
        data: {
          id: "mock-id-" + Date.now(),
          ...body,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    }
  } catch (error) {
    console.error("Error in mock POST handler:", error)
    return NextResponse.json(
      { code: 500, message: "Internal Server Error", error: String(error), data: null },
      { status: 500 },
    )
  }
}

