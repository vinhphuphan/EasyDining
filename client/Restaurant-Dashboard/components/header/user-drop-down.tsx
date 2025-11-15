"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, Pencil } from "lucide-react"
import { EmployeeProfileModal } from "@/components/modals/employee-profile-modal"
import { toast } from "sonner"

interface User {
    id: number
    username: string
    avatar: string
    role: string
}

export default function UserDropdown() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Get user from localStorage when component mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser))
            } catch (err) {
                console.error("Error parsing stored user:", err)
                localStorage.removeItem("user")
            }
        }
    }, [])

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", { method: "POST" })
            if (res.ok) {
                localStorage.removeItem("user")
                toast.success("Logged out")
                router.push("/login")
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data?.message || "Logout failed. Please try again.")
            }
        } catch (error) {
            console.error("Error when log out : ", error);
            toast.error("Network error. Please try again.")
        }
    }

    const goSettings = () => router.push("/")

    if (!currentUser) {
        // Return null while user data is loading
        return null
    }

    return (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none cursor-pointer">
                    <Avatar className="h-9 w-9">
                        <AvatarImage
                            src={currentUser.avatar || "/placeholder.svg"}
                            alt={currentUser.username}
                        />
                        <AvatarFallback>{currentUser.username}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-sm text-left">
                        <div className="font-medium leading-tight">{currentUser.username}</div>
                        <div className="text-xs text-muted-foreground">{currentUser.role}</div>
                    </div>
                    <svg
                        className={`transition-transform duration-200 ${open ? "rotate-180" : ""}
                        `}
                        width="18"
                        height="20"
                        viewBox="0 0 18 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={goSettings} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <EmployeeProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                employee={currentUser}
            />
        </>
    )
}

