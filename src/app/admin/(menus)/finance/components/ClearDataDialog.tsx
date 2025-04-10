"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"

interface ClearDataDialogProps {
  onClearData: () => Promise<void>
  isClearing: boolean
}

export function ClearDataDialog({ onClearData, isClearing }: ClearDataDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClearData = async () => {
    await onClearData()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" /> Hapus Semua Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Penghapusan Data</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus semua data pemasukan? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isClearing}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleClearData} disabled={isClearing}>
            {isClearing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghapus...
              </>
            ) : (
              "Hapus Semua Data"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

