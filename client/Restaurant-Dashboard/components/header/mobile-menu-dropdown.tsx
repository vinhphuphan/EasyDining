"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, LogOut, Settings, Pencil, Cloud } from "lucide-react"
import { toast } from "sonner"
import { EmployeeProfileModal } from "@/components/modals/employee-profile-modal"

interface MobileMenuDropdownProps {
    tabs: { href: string; label: string; icon: any }[]
}

export default function MobileMenuDropdown({ tabs }: MobileMenuDropdownProps) {
    const router = useRouter()
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const currentUser = {
        id: 1011425,
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

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="p-2 hover:bg-accent rounded-lg">
                    <Menu className="h-6 w-6" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex items-center gap-2">
                        <Cloud className="h-4 w-4 text-primary" />
                        <span>EasyDining</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* App navigation */}
                    {tabs.map((t) => (
                        <DropdownMenuItem
                            key={t.href}
                            onClick={() => router.push(t.href)}
                            className="cursor-pointer flex items-center gap-2"
                        >
                            <t.icon className="h-4 w-4" />
                            {t.label}
                        </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    {/* Profile actions */}
                    <DropdownMenuItem
                        onClick={() => setIsProfileOpen(true)}
                        className="cursor-pointer flex items-center gap-2"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => router.push("/settings")}
                        className="cursor-pointer flex items-center gap-2"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 cursor-pointer flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EmployeeProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                employee={currentUser}
                onUpdate={(updatedUser) => {
                    // handle update (e.g. refresh state, show a toast)
                    toast.success("Profile updated")
                }}
            />
        </>
    )
}
