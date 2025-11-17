"use client"

import { useEffect, useState } from "react"
import { X, User, Lock, Monitor, Check, Pencil } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PinPad } from "@/components/login-pin/pin-pad"
import {
    useGetUserByIdQuery,
    useUpdateUserMutation,
} from "@/store/api/userApi"
import { ImageUploader } from "@/components/image-uploader"
import { toast } from "sonner"

interface EmployeeProfileModalProps {
    isOpen: boolean
    onClose: () => void
    employee?: {
        id: number
    }
    onUpdate: (updatedUser: any) => void
}

export function EmployeeProfileModal({ isOpen, onClose, employee, onUpdate }: EmployeeProfileModalProps) {
    const [activeTab, setActiveTab] = useState<"employee" | "security" | "display">("employee")
    const [isEditMode, setIsEditMode] = useState(false)
    const [showAvatarUploader, setShowAvatarUploader] = useState(false)
    const [showChangePinModal, setShowChangePinModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [pin, setPin] = useState("")

    const { data: user, isLoading, refetch } = useGetUserByIdQuery(
        employee?.id ?? 0,
        { skip: !employee?.id }
    )

    const [editedEmployee, setEditedEmployee] = useState<any>(null)
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

    useEffect(() => {
        if (user) {
            setEditedEmployee(user)
        }
    }, [user])

    // Save Profile Changes
    const handleSaveProfile = async () => {
        if (!editedEmployee) return

        try {
            await updateUser({
                id: editedEmployee.id,
                updates: {
                    username: editedEmployee.username,
                    email: editedEmployee.email,
                    role: editedEmployee.role,
                    avatar: editedEmployee.avatar,
                    shiftStart: editedEmployee.shiftStart,
                    shiftEnd: editedEmployee.shiftEnd
                }
            }).unwrap()

            toast.success("Profile updated successfully");

            onUpdate({ ...editedEmployee });

            setIsEditMode(false);

        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update user")
        }
    }

    // Change PIN
    const handlePinComplete = (completedPin: string) => setPin(completedPin)

    const handleChangePinSubmit = async () => {
        if (!user || pin.length !== 6) return

        try {
            const updated = await updateUser({
                id: user.id,
                updates: {
                    ...editedEmployee,
                    pinCode: pin
                }
            }).unwrap()

            onUpdate(updated)
            toast.success("PIN updated successfully!")
            setShowChangePinModal(false)
            setShowSuccessModal(true)
            setPin("")
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update PIN")
        }
    }

    if (isLoading || !editedEmployee) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="flex items-center justify-center h-60">
                    <span className="text-muted-foreground">Loading user...</span>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <>
            {/* MAIN PROFILE MODAL */}
            <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
                <DialogHeader className="hidden">
                    <DialogTitle></DialogTitle>
                </DialogHeader>

                <DialogContent
                    className="!max-w-3xl lg:!max-w-4xl xl:!max-w-5xl w-full max-h-[90vh] overflow-hidden p-0"
                    showCloseButton={false}
                    onInteractOutside={(event) => event.preventDefault()}
                >
                    <div className="flex h-[85vh]">

                        {/* Sidebar */}
                        <div className="w-64 border-r bg-muted/30 p-6 space-y-2">
                            <h2 className="text-lg font-semibold mb-4">Settings</h2>

                            {["employee", "security", "display"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors 
                                        ${activeTab === tab ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
                                >
                                    {tab === "employee" && <User className="h-5 w-5" />}
                                    {tab === "security" && <Lock className="h-5 w-5" />}
                                    {tab === "display" && <Monitor className="h-5 w-5" />}
                                    <span className="capitalize">{tab}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8">

                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold capitalize">{activeTab}</h3>
                                <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Employee Tab */}
                            {activeTab === "employee" && (
                                <>
                                    {/* Avatar + ID */}
                                    <div className="flex items-center justify-between pb-6 border-b">
                                        <div className="flex items-center gap-4">
                                            <div className="relative group">
                                                <Avatar className="h-20 w-20 border shadow-sm">
                                                    <AvatarImage src={editedEmployee.avatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{editedEmployee.username[0]}</AvatarFallback>
                                                </Avatar>

                                                {isEditMode && (
                                                    <button
                                                        onClick={() => setShowAvatarUploader(true)}
                                                        className="absolute bottom-0 right-0 bg-black/70 text-white p-1.5 rounded-full"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-sm text-muted-foreground">Employee ID: #{editedEmployee.id}</p>
                                                <p className="text-md font-medium">{editedEmployee.username}</p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Shift</p>
                                            <p className="text-md font-medium">
                                                {editedEmployee.shiftStart && editedEmployee.shiftEnd
                                                    ? `${editedEmployee.shiftStart} → ${editedEmployee.shiftEnd}`
                                                    : "Not assigned"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Editable Fields */}
                                    <div className="mt-6">
                                        <div className="flex justify-between mb-3">
                                            <h4 className="font-medium">Employee Information</h4>

                                            {!isEditMode ? (
                                                <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                                                    <Pencil className="h-4 w-4 mr-1" /> Edit
                                                </Button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => setIsEditMode(false)}>Cancel</Button>
                                                    <Button size="sm" disabled={isUpdating} onClick={handleSaveProfile}>
                                                        {isUpdating ? "Saving..." : "Save"}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">

                                            {/* Username */}
                                            <div className="space-y-2">
                                                <Label>Username</Label>
                                                <Input
                                                    disabled={!isEditMode}
                                                    value={editedEmployee.username}
                                                    onChange={(e) => setEditedEmployee({ ...editedEmployee, username: e.target.value })}
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input
                                                    disabled={!isEditMode}
                                                    value={editedEmployee.email || ""}
                                                    onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                                                />
                                            </div>

                                            {/* Role */}
                                            <div className="space-y-2">
                                                <Label>Role</Label>
                                                {isEditMode ? (
                                                    <select
                                                        value={editedEmployee.role}
                                                        onChange={(e) => setEditedEmployee({ ...editedEmployee, role: e.target.value })}
                                                        className="border px-2 py-2 rounded-lg text-sm w-full"
                                                    >
                                                        <option value="Admin">Admin</option>
                                                        <option value="Staff">Staff</option>
                                                    </select>
                                                ) : (
                                                    <p className="mt-1 text-md">{editedEmployee.role}</p>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </>
                            )}

                            {/* SECURITY */}
                            {activeTab === "security" && (
                                <div className="space-y-6">
                                    <div className="p-6 border rounded-lg flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold mb-1">PIN</h4>
                                            <p className="text-sm text-muted-foreground">Update login PIN</p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setShowChangePinModal(true)}>
                                            Change PIN →
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* DISPLAY */}
                            {activeTab === "display" && (
                                <div className="p-6 border rounded-lg text-sm text-muted-foreground">
                                    Display preferences coming soon…
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* CHANGE PIN MODAL */}
            <Dialog open={showChangePinModal} onOpenChange={setShowChangePinModal}>
                <DialogHeader className="hidden">
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <DialogContent className="max-w-md">
                    <h2 className="text-lg font-semibold mb-3">Change PIN</h2>

                    <div className="text-center">
                        <div className="flex justify-center gap-2 mb-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={`h-10 w-10 border rounded-lg flex items-center justify-center`}>
                                    {i < pin.length && <div className="h-3 w-3 rounded-full bg-primary" />}
                                </div>
                            ))}
                        </div>

                        <PinPad maxLength={6} onComplete={handlePinComplete} />
                    </div>

                    <Button disabled={pin.length !== 6} className="w-full mt-6" onClick={handleChangePinSubmit}>
                        Confirm PIN
                    </Button>
                </DialogContent>
            </Dialog>

            {/* SUCCESS MODAL */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogHeader className="hidden">
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <DialogContent className="max-w-md text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white">
                        <Check className="w-8 h-8" />
                    </div>

                    <h2 className="text-lg font-semibold mt-4">PIN Updated!</h2>
                    <p className="text-muted-foreground mb-6">Your PIN has been successfully updated.</p>
                    <Button onClick={() => setShowSuccessModal(false)} className="w-full">OK</Button>
                </DialogContent>
            </Dialog>

            {/* AVATAR EDIT */}
            <Dialog open={showAvatarUploader} onOpenChange={setShowAvatarUploader} modal={false}>
                <DialogHeader className="hidden">
                    <DialogTitle>Update Avatar</DialogTitle>
                </DialogHeader>
                <DialogContent className="max-w-xs!" onInteractOutside={(event) => event.preventDefault()}>
                    <h3 className="font-semibold mb-4 text-center">Update Avatar</h3>

                    <div className="flex items-center justify-center">
                        <ImageUploader
                            disabled={false}
                            onUploadSuccess={(url) => {
                                setEditedEmployee({ ...editedEmployee, avatar: url })
                                setShowAvatarUploader(false)
                            }}
                        />
                    </div>

                    <Button variant="outline" className="w-full mt-4" onClick={() => setShowAvatarUploader(false)}>
                        Cancel
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    )
}
