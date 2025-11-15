"use client"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface SuccessOrderToastProps {
  open: boolean
  onClose: () => void
  amount: number
  orderId: number | string
  date: string | Date
  receiptEmail?: string
}

export const SuccessOrderToast = ({
  open,
  onClose,
  amount,
  orderId,
  date,
  receiptEmail
}: SuccessOrderToastProps) => {
  const displayDate = useMemo(() => {
    try {
      const d = typeof date === "string" ? new Date(date) : date
      return d.toLocaleString()
    } catch {
      return String(date)
    }
  }, [date])

  const formattedAmount = useMemo(() => {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount)
    } catch {
      return `$${amount.toFixed(2)}`
    }
  }, [amount])

  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60] animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl border border-gray-100 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Icon */}
          <motion.div
            className="mb-8"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
            >
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-3xl font-bold text-gray-900 mb-4">Success!</h1>
            <p className="text-gray-500">Your order has been created successfully</p>
          </motion.div>

          {/* Payment Details */}
          <motion.div
            className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Amount</span>
              <span className="text-lg font-semibold text-gray-900">{formattedAmount}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Transaction ID</span>
              <span className="text-gray-900 font-mono text-sm">#{String(orderId)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Date</span>
              <span className="text-gray-900">{displayDate}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="space-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Button
              onClick={onClose}
              size="lg"
              className="w-full h-12 cursor-pointer"
            >
              Continue Shopping
            </Button>
          </motion.div>

          {/* Footer Message */}
          <motion.div
            className="mt-8 text-gray-500 text-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.65 }}
          >
            <p>Thank you for your purchase!</p>
            {receiptEmail && <p>A confirmation has been sent to {receiptEmail}.</p>}
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

