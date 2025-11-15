"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { useGetTablesQuery } from "@/store/api/tableApi"
import type { OrderFormData } from "@/components/modals/create-order-modal"

interface SelectTableStepProps {
  formData: OrderFormData
  setFormData: (data: OrderFormData) => void
  onNext: () => void
}

export function SelectTableStep({ formData, setFormData, onNext }: SelectTableStepProps) {
  const { data, isLoading } = useGetTablesQuery()
  const tables = data ?? []

  const [selectedTable, setSelectedTable] = useState<string | null>(formData.tableCode || null)

  // Take Away -> skip select table
  if (formData.orderType === "Take Away") return null

  if (isLoading) {
    return <div className="p-8 text-center">Loading tables...</div>
  }

  const handleTableSelect = (table: any) => {
    if (table.status === "Available" || table.status === "Occupied") {
      setSelectedTable(table.tableCode)
      setFormData({ ...formData, tableCode: table.tableCode })
    }
  }

  const handleContinue = () => {
    if (selectedTable) onNext()
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Legends */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-sm">
              <span className="w-4 h-4 rounded bg-card border-2 border-primary"></span>
              Available
            </span>
            <span className="flex items-center gap-2 text-sm">
              <span className="w-4 h-4 rounded bg-orange-500"></span>
              Occupied
            </span>
          </div>
        </div>

        {/* Table Layout the same */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {tables.map((table) => {
            const isSelected = selectedTable === table.tableCode
            const isAvailable = table.status === "Available"
            const isOccupied = table.status === "Occupied"

            return (
              <button
                key={table.id}
                onClick={() => handleTableSelect(table)}
                className={`relative aspect-square rounded-2xl border-4 flex flex-col items-center justify-center transition-all
  ${isSelected
                    ? "border-primary bg-primary/10 scale-105"
                    : isAvailable
                      ? "border-border bg-card hover:border-primary/50 hover:scale-105"
                      : isOccupied
                        ? "border-orange-500 bg-orange-500/10 hover:border-primary/50 hover:scale-105"
                        : "border-muted bg-muted cursor-not-allowed opacity-50"
                  }`}
              >
                <span className="text-2xl font-bold mb-2">{table.name}</span>

                {isOccupied && table.name && (
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-xs">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded">
                      Active
                    </span>
                    <span className="bg-orange-500 text-white px-2 py-1 rounded">
                      #{table.name}
                    </span>
                  </div>
                )}

                {isOccupied && (
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Occupied
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


