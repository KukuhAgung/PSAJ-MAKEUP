export interface IncomeData {
    id: string
    date: string
    category: string
    totalSales: number
    amount: number
    description: string
  }
  
  export interface MonthlySummary {
    month: string
    year: number
    total: number
    totalSales: number
    categories: {
      [key: string]: number
    }
  }
  
  export interface ImportedData {
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
  
  export interface Notification {
    id: string
    type: "success" | "error"
    title: string
    message: string
  }
  
  