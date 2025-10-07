
"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface PinPadProps {
  onNumberClick: (num: string) => void
  onDelete: () => void
}

export function PinPad({ onNumberClick, onDelete }: PinPadProps) {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0"],
  ]

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-full max-w-sm space-y-2">
        {numbers.map((row, rowIndex) => {

          if (rowIndex !== 3) {
            return (
              <div key={rowIndex} className="grid grid-cols-3 gap-2 ">
                {row.map((num) => (
                  <Button
                    key={num}
                    variant="ghost"
                    size="lg"
                    onClick={() => onNumberClick(num)}
                    className="h-12 text-2xl font-medium hover:bg-primary/20 cursor-pointer"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            )
          }


          const zero = row[0]
          return (
            <div key={rowIndex} className="grid grid-cols-3 gap-2">
              <div />
              <Button
                key={zero}
                variant="ghost"
                size="lg"
                onClick={() => onNumberClick(zero)}
                className="h-12 text-2xl font-medium hover:bg-primary/20 cursor-pointer"
              >
                {zero}
              </Button>
              <Button variant="ghost" size="lg" onClick={onDelete} className="h-12 hover:bg-primary/20 cursor-pointer">
                <X className="h-6 w-6" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}