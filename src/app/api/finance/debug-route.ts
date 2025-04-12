import { NextResponse } from "next/server"

// Endpoint debugging sederhana untuk memeriksa koneksi database
export async function GET() {
  try {
    // Periksa apakah variabel lingkungan DATABASE_URL ada
    const dbUrl = process.env.DATABASE_URL

    return NextResponse.json({
      status: "success",
      message: "Debug endpoint is working",
      databaseConfigured: !!dbUrl,
      // Jangan tampilkan URL database lengkap karena alasan keamanan
      databaseUrlPrefix: dbUrl ? dbUrl.split("://")[0] : "not configured",
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Debug endpoint encountered an error",
        error: String(error),
      },
      { status: 500 },
    )
  }
}

