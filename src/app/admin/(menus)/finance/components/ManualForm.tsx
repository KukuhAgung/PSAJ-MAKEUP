"use client"

import type React from "react"
import { useEffect } from "react"
import type { IncomeData } from "../types"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface ManualFormProps {
  newIncome: any
  setNewIncome: (income: any) => void
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  isSubmitting: boolean
}

export function ManualForm({ newIncome, setNewIncome, selectedDate, setSelectedDate, isSubmitting }: ManualFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewIncome({
      ...newIncome,
      [name]: name === "amount" || name === "totalSales" ? Number(value) : value,
    })
  }

  useEffect(() => {
    // Set kategori default ke "Jasa Make Up" jika belum diisi
    if (!newIncome.category) {
      setNewIncome((prev: Omit<IncomeData, "id">) => ({
        ...prev,
        category: "Jasa Make Up",
      }))
    }
  }, [])

  return (
    <form id="manual-income-form" className="grid gap-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date" className="block mb-2">
            Tanggal
          </Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  locale={id}
                />
              </PopoverContent>
            </Popover>
            <Input id="date" name="date" type="hidden" value={newIncome.date} required />
          </div>
        </div>
        <div>
          <Label htmlFor="category" className="block mb-2">
            Kategori
          </Label>
          <Input
            id="category"
            name="category"
            value="Jasa Make Up"
            className="w-full bg-gray-100"
            disabled={true}
            required
          />
        </div>
        <div>
          <Label htmlFor="totalSales" className="block mb-2">
            Total Penjualan
          </Label>
          <Input
            id="totalSales"
            name="totalSales"
            type="number"
            value={newIncome.totalSales || ""}
            onChange={handleInputChange}
            className="w-full"
            disabled={isSubmitting}
            required
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="amount" className="block mb-2">
            Jumlah
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={newIncome.amount || ""}
            onChange={handleInputChange}
            className="w-full"
            disabled={isSubmitting}
            required
            min="0"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="description" className="block mb-2">
            Deskripsi
          </Label>
          <Input
            id="description"
            name="description"
            value={newIncome.description}
            onChange={handleInputChange}
            className="w-full"
            disabled={isSubmitting}
            required
          />
        </div>
      </div>
    </form>
  )
}

