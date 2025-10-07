"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus } from "lucide-react"
import type { OrderFormData } from "@/components/create-order-modal"

interface OrderInfoStepProps {
  formData: OrderFormData
  setFormData: (data: OrderFormData) => void
  onNext: () => void
}

export function OrderInfoStep({ formData, setFormData, onNext }: OrderInfoStepProps) {
  return (
    <div className="p-12 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Order Info</h2>

      <div className="space-y-8">
        {/* Order Type */}
        <div>
          <Label className="text-base mb-3 block">Order Type</Label>
          <div className="flex gap-4">
            <button
              onClick={() => setFormData({ ...formData, orderType: "Dine In" })}
              className={`flex-1 px-6 py-4 rounded-xl border-2 text-base font-medium transition-all ${
                formData.orderType === "Dine In"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              Dine In
            </button>
            <button
              onClick={() => setFormData({ ...formData, orderType: "Take Away" })}
              className={`flex-1 px-6 py-4 rounded-xl border-2 text-base font-medium transition-all ${
                formData.orderType === "Take Away"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              Take Away
            </button>
          </div>
        </div>

        {/* Number of People */}
        <div>
          <Label className="text-base mb-3 block">How many people</Label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFormData({ ...formData, numberOfPeople: Math.max(1, formData.numberOfPeople - 1) })}
              className="p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="text-2xl font-semibold w-12 text-center">{formData.numberOfPeople}</span>
            <button
              onClick={() => setFormData({ ...formData, numberOfPeople: formData.numberOfPeople + 1 })}
              className="p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Baby Chair */}
        <div>
          <Label className="text-base mb-3 block">Baby Chair</Label>
          <div className="flex gap-4">
            <button
              onClick={() => setFormData({ ...formData, babyChair: false })}
              className={`flex-1 px-6 py-4 rounded-xl border-2 text-base font-medium transition-all ${
                !formData.babyChair
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              No
            </button>
            <button
              onClick={() => setFormData({ ...formData, babyChair: true })}
              className={`flex-1 px-6 py-4 rounded-xl border-2 text-base font-medium transition-all ${
                formData.babyChair
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              Yes
            </button>
          </div>
        </div>

        {/* Customer Name */}
        <div>
          <Label htmlFor="customerName" className="text-base mb-3 block">
            Customer Name
          </Label>
          <Input
            id="customerName"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="h-12 text-base"
          />
        </div>

        {/* Continue Button */}
        <Button size="lg" className="w-full h-12 text-base" onClick={onNext} disabled={!formData.customerName}>
          Continue →
        </Button>
      </div>
    </div>
  )
}
