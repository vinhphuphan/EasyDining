"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useCreateTableMutation } from "@/store/api/tableApi"

export default function AddTableModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [createTable, { isLoading }] = useCreateTableMutation()
    const [show, setShow] = useState(false)
    const [name, setName] = useState("")
    const [seats, setSeats] = useState(2)

    useEffect(() => setShow(isOpen), [isOpen])

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Table name is required")
            return
        }

        try {
            await createTable({ name, seats }).unwrap()
            toast.success(`Table "${name}" created successfully`)
            onClose()
        } catch (error) {
            console.error(error)
            toast.error("Failed to create table")
        }
    }

    return (
        <Dialog open={show} onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Table</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Table Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-2" placeholder="e.g. Table 1" />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Seats</label>
                        <Input
                            type="number"
                            value={seats}
                            onChange={(e) => setSeats(Number(e.target.value) || 1)}
                            className="mt-2"
                            min={1}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
                            {isLoading ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
