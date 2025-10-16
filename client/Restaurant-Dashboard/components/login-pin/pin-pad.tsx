
"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

import { useState } from "react"

interface PinPadProps {
  onNumberClick?: (num: string) => void
  onDelete?: () => void
  onComplete?: (pin: string) => void
  maxLength?: number
}

export function PinPad({ onNumberClick, onDelete, onComplete, maxLength = 6 }: PinPadProps) {
  const [value, setValue] = useState("")
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
                    onClick={() => {
                      // call legacy handler if provided
                      onNumberClick?.(num)

                      if (onComplete) {
                        const next = (value + num).slice(0, maxLength)
                        setValue(next)
                        if (next.length >= maxLength) onComplete(next)
                      }
                    }}
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
                onClick={() => {
                  onNumberClick?.(zero)
                  if (onComplete) {
                    const next = (value + zero).slice(0, maxLength)
                    setValue(next)
                    if (next.length >= maxLength) onComplete(next)
                  }
                }}
                className="h-12 text-2xl font-medium hover:bg-primary/20 cursor-pointer"
              >
                {zero}
              </Button>
              <Button variant="ghost" size="lg" onClick={() => {
                onDelete?.()
                if (onComplete) {
                  const next = value.slice(0, -1)
                  setValue(next)
                }
              }} className="h-12 hover:bg-primary/20 cursor-pointer">
                <X className="h-6 w-6" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}