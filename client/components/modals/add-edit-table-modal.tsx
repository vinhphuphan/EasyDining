"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Table } from "@/lib/mock-data"

interface Props {
    isOpen: boolean
    onClose: () => void
    onSave: (table: Table) => void
    initial?: Table | null
}

export default function AddEditTableModal({ isOpen, onClose, onSave, initial }: Props) {
    const [show, setShow] = useState(false)
    const [number, setNumber] = useState("")
    const [capacity, setCapacity] = useState(2)
    const [floor, setFloor] = useState("First Floor")
    const [status, setStatus] = useState<"available" | "occupied" | "reserved">("available")

    useEffect(() => {
        if (isOpen) setShow(true)
        else setShow(false)
    }, [isOpen])

    useEffect(() => {
        if (initial) {
            setNumber(initial.number)
            setCapacity(initial.capacity)
            setFloor(initial.floor)
            setStatus(initial.status)
        } else {
            setNumber("")
            setCapacity(2)
            setFloor("First Floor")
            setStatus("available")
        }
    }, [initial])

    const handleSave = () => {
        const id = initial?.id ?? `t_${Date.now()}`
        onSave({
            id,
            number,
            capacity,
            floor,
            status,
        } as Table)
        onClose()
    }

    return (
        <Dialog open={show} onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{initial ? "Edit Table" : "Add Table"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Table Number</label>
                        <Input value={number} onChange={(e) => setNumber(e.target.value)} className="mt-2" />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Capacity</label>
                        <Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value) || 1)} className="mt-2" />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Floor</label>
                        <Select value={floor} onValueChange={setFloor}>
                            <SelectTrigger className="mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="First Floor">First Floor</SelectItem>
                                <SelectItem value="Second Floor">Second Floor</SelectItem>
                                <SelectItem value="Third Floor">Third Floor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                            <SelectTrigger className="mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="occupied">Occupied</SelectItem>
                                <SelectItem value="reserved">Reserved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button className="cursor-pointer" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button className="cursor-pointer" onClick={handleSave} disabled={!number}>Save</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
