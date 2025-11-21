"use client"

import { useEffect, useState } from "react"
import { X, ArrowLeft, User, UtensilsCrossed, ClipboardList } from "lucide-react"
import { toast } from "sonner"
import { OrderInfoStep } from "@/components/order-steps/order-info-step"
import { SelectTableStep } from "@/components/order-steps/select-table-step"
import { SelectMenuStep } from "@/components/order-steps/select-menu-step"
import { OrderSummaryStep } from "@/components/order-steps/order-summary-step"

interface CreateOrderModalProps {
  isOpen: boolean
  onClose: () => void
}

export type OrderFormData = {
  orderType: "Dine In" | "Take Away"
  numberOfPeople: number
  customerName?: string
  buyerNote?: string
  tableCode?: string
  items: Array<{
    menuItemId: number;
    name: string
    price: number
    quantity: number
    imageUrl?: string
    note?: string
  }>
}

export function CreateOrderModal({ isOpen, onClose }: CreateOrderModalProps) {
  const defaultState: OrderFormData = {
    orderType: "Dine In",
    numberOfPeople: 2,
    customerName: "",
    buyerNote: "",
    items: [],
  }
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [formData, setFormData] = useState<OrderFormData>(defaultState)

  // Local flag to trigger entrance animation on mount
  const [show, setShow] = useState(false)
  const isTakeAway = formData.orderType === "Take Away"

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setShow(true))
      return () => cancelAnimationFrame(id)
    }
    setShow(false)
  }, [isOpen])

  if (!isOpen) return null

  const handleBack = () => {
    setStep((prev) => {
      if (prev === 3 && isTakeAway) return 1
      return prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev
    })
  }

  const handleNext = () => {
    setStep((prev) => {
      if (prev === 1 && isTakeAway) return 3
      if (prev === 2 && isTakeAway) return 3
      return (Math.min(prev + 1, 4) as 1 | 2 | 3 | 4)
    })
  }

  const handleClose = () => {
    setStep(1)
    setFormData(defaultState)
    onClose()
  }

  const steps = [
    { number: 1, label: "Customer Information", icon: User },
    { number: 2, label: "Select Table", icon: ClipboardList },
    { number: 3, label: "Select Menu", icon: UtensilsCrossed },
    { number: 4, label: "Order Summary", icon: ClipboardList },
  ]

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${show ? "bg-black/50 opacity-100" : "bg-black/50 opacity-0"
        }`}
    >
      <div
        className={`bg-background rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-250 ease-out ${show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button onClick={handleBack} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center gap-3">
              {steps.map((s, index) => (
                <div key={s.number} className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (s.number >= step) return
                      if (isTakeAway && s.number === 2) {
                        setStep(1)
                      } else {
                        setStep(s.number as 1 | 2 | 3 | 4)
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${step === s.number
                      ? "bg-primary text-primary-foreground"
                      : step > s.number
                        ? "bg-primary/20 text-primary hover:bg-primary/30"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    <s.icon className="h-4 w-4" />
                    {s.label}
                  </button>
                  {index < steps.length - 1 && <span className="text-muted-foreground">→</span>}
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && <OrderInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} />}
          {step === 2 && <SelectTableStep formData={formData} setFormData={setFormData} onNext={handleNext} />}
          {step === 3 && <SelectMenuStep formData={formData} setFormData={setFormData} onNext={handleNext} />}
          {step === 4 && <OrderSummaryStep formData={formData} setFormData={setFormData} onClose={handleClose} onCreated={() => { setFormData(defaultState); setStep(1) }} />}
        </div>
      </div>
    </div>
  )
}


