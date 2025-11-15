"use client"

import React, { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from "react"
import { SuccessOrderToast } from "@/components/order-steps/success-order-toast"

type SuccessToastPayload = {
    amount: number
    orderId: string | number
    date: string | Date
    receiptEmail?: string
}

type Context = {
    showToast: (payload: SuccessToastPayload) => void
    hideToast: () => void
}

const SuccessOrderToastContext = createContext<Context | undefined>(undefined)

export function SuccessOrderToastProvider({ children }: PropsWithChildren) {
    const [open, setOpen] = useState(false)
    const [payload, setPayload] = useState<SuccessToastPayload | null>(null)

    const hideToast = useCallback(() => setOpen(false), [])
    const showToast = useCallback((data: SuccessToastPayload) => {
        setPayload(data)
        setOpen(true)
        setTimeout(() => setOpen(false), 3000)
    }, [])

    const value = useMemo(() => ({ showToast, hideToast }), [showToast, hideToast])

    return (
        <SuccessOrderToastContext.Provider value={value}>
            {children}
            {payload && (
                <SuccessOrderToast
                    open={open}
                    onClose={hideToast}
                    amount={payload.amount}
                    orderId={payload.orderId}
                    date={payload.date}
                    receiptEmail={payload.receiptEmail}
                />
            )}
        </SuccessOrderToastContext.Provider>
    )
}

export function useSuccessOrderToast() {
    const ctx = useContext(SuccessOrderToastContext)
    if (!ctx) throw new Error("useSuccessOrderToast must be used inside SuccessOrderToastProvider")
    return ctx
}
