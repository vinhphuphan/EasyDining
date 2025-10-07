"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { tables } from "@/lib/mock-data"
import type { OrderFormData } from "@/components/create-order-modal"
import { Clock } from "lucide-react"

interface SelectTableStepProps {
  formData: OrderFormData
  setFormData: (data: OrderFormData) => void
  onNext: () => void
}

export function SelectTableStep({ formData, setFormData, onNext }: SelectTableStepProps) {
  const [selectedFloor, setSelectedFloor] = useState("First Floor")
  const [selectedTable, setSelectedTable] = useState<string | null>(formData.tableNumber || null)

  const floors = Array.from(new Set(tables.map((t) => t.floor)))
  const floorTables = tables.filter((t) => t.floor === selectedFloor)

  const handleTableSelect = (tableNumber: string, status: string) => {
    if (status === "available") {
      setSelectedTable(tableNumber)
      setFormData({ ...formData, tableNumber })
    }
  }

  const handleContinue = () => {
    if (selectedTable) {
      onNext()
    }
  }

  if (formData.orderType === "Take Away") {
    onNext()
    return null
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-sm">
              <span className="w-4 h-4 rounded bg-card border-2 border-border"></span>
              Available
            </span>
            <span className="flex items-center gap-2 text-sm">
              <span className="w-4 h-4 rounded bg-muted"></span>
              Not Available
            </span>
            <span className="flex items-center gap-2 text-sm">
              <span className="w-4 h-4 rounded bg-orange-500"></span>
              Reserved
            </span>
            <span className="flex items-center gap-2 text-sm">
              <span className="w-4 h-4 rounded bg-muted-foreground/20"></span>
              Can't Select
            </span>
          </div>

          <div className="flex gap-2">
            {floors.map((floor) => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFloor === floor
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {floor === "First Floor" ? "1st Floor" : floor === "Second Floor" ? "2nd Floor" : "3rd Floor"}
              </button>
            ))}
          </div>
        </div>

        {/* Table Layout */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {floorTables.map((table) => {
            const isSelected = selectedTable === table.number
            const isAvailable = table.status === "available"
            const isOccupied = table.status === "occupied"

            return (
              <button
                key={table.id}
                onClick={() => handleTableSelect(table.number, table.status)}
                disabled={!isAvailable}
                className={`relative aspect-square rounded-2xl border-4 flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 scale-105"
                    : isAvailable
                      ? "border-border bg-card hover:border-primary/50 hover:scale-105"
                      : isOccupied
                        ? "border-orange-500 bg-orange-500/10 cursor-not-allowed"
                        : "border-muted bg-muted cursor-not-allowed opacity-50"
                }`}
              >
                <span className="text-2xl font-bold mb-2">{table.number}</span>
                {isOccupied && table.currentOrderId && (
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-xs">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded">A6</span>
                    <span className="bg-orange-500 text-white px-2 py-1 rounded">DI104</span>
                  </div>
                )}
                {isOccupied && (
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      In Progress
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <Button
          size="lg"
          className="w-full max-w-md mx-auto block h-12"
          onClick={handleContinue}
          disabled={!selectedTable}
        >
          Continue →
        </Button>
      </div>
    </div>
  )
}
