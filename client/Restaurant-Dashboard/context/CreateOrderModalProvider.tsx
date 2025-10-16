'use client'
import React, { createContext, useContext, useState } from 'react'

type Context = {
    open: boolean
    openModal: () => void
    closeModal: () => void
}

const CreateOrderModalContext = createContext<Context | undefined>(undefined)

export function CreateOrderModalProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const openModal = () => setOpen(true)
    const closeModal = () => setOpen(false)

    return (
        <CreateOrderModalContext.Provider value={{ open, openModal, closeModal }}>
            {children}
        </CreateOrderModalContext.Provider>
    )
}

export function useCreateOrderModal() {
    const ctx = useContext(CreateOrderModalContext)
    if (!ctx) throw new Error('useCreateOrderModal must be used within CreateOrderModalProvider')
    return ctx
}


