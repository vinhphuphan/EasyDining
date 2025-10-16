"use client"

import { CreateOrderModal } from "@/components/modals/create-order-modal"
import { useCreateOrderModal } from "@/context/CreateOrderModalProvider"

export default function CreateOrderModalRenderer() {
    const { open, closeModal } = useCreateOrderModal()
    return <CreateOrderModal isOpen={open} onClose={closeModal} />
}


