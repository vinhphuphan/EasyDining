"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface Props {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => Promise<void> | void
    title?: string
    description?: string
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title = "Delete", description = "Are you sure? This action cannot be undone." }: Props) {
    const handleDelete = async () => {
        try {
            await onConfirm()
            onClose()
        } catch (error) {
            console.error("Delete failed:", error)
            toast.error(error instanceof Error ? error.message : "Something went wrong")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <div className="flex gap-2 justify-end">
                    <Button className="cursor-pointer" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
