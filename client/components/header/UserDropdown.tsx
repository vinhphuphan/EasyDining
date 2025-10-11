"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User as UserIcon, Pencil, ChevronDown } from "lucide-react"
import { EmployeeProfileModal } from "@/components/modals/employee-profile-modal"
import { toast } from "sonner"

export default function UserDropdown() {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const currentUser = {
        id: "01011425",
        name: "Richardo Wilson",
        role: "Waiter",
        avatar: "/professional-man.jpg",
        shift: "10:00 AM - 12:00 PM",
        phone: "(629) 555-0123",
        email: "ajpdesign.info@gmail.com",
        address: "390 Market Street, Suite 200",
        joiningDate: "1 Jan, 2025",
        employmentStatus: "Full-Time Employment",
        manager: "Alexander Rodriguez",
    }

    const handleLogout = () => {
        document.cookie = "ed_auth=; Max-Age=0; path=/"
        toast.success("Logged out")
        router.push("/login")
    }

    const goProfile = () => router.push("/profile")
    const goSettings = () => router.push("/settings")

    const [isProfileOpen, setIsProfileOpen] = useState(false)

    return (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none cursor-pointer">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                            {currentUser.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-sm text-left">
                        <div className="font-medium leading-tight">{currentUser.name}</div>
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
                    <DropdownMenuItem onClick={goProfile} className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>View profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit profile</span>
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

