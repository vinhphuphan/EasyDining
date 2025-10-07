"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cloud, Bell, CheckCircle, FileText, Clock, ChevronDown, Dice4, Calendar, Dock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationPanel } from "@/components/notification-panel"

export default function Header() {
    const path = usePathname()
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)

    const currentUser = {
        name: "Richardo",
        role: "Waiter",
        avatar: "/professional-man.jpg",
    }

    const unreadNotifications = 3

    const tabs = [
        { href: "/dashboard", label: "Dashboard", icon: CheckCircle },
        { href: "/order", label: "Order", icon: FileText },
        { href: "/table", label: "Table", icon: Calendar },
        { href: "/menu", label: "Menu", icon: Dock },
        { href: "/history", label: "History", icon: Clock },
    ]

    // nếu pathname bắt đầu bằng /login thì không render nav
    if (path?.startsWith("/login")) return null

    return (
        <>
            <header className="border-b bg-card sticky top-0 z-30">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Cloud className="h-6 w-6 text-primary" />
                            <span className="text-xl font-semibold">EasyDining</span>
                        </div>

                        <nav className="hidden md:flex items-center gap-1">
                            {tabs.map((t) => {
                                const active = path === t.href
                                return (
                                    <Link
                                        key={t.href}
                                        href={t.href}
                                        className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                            }`}
                                    >
                                        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${active ? "bg-primary/20" : ""}`}>
                                            <t.icon className="h-4 w-4" />
                                        </div>
                                        {t.label}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsNotificationOpen(true)}
                            className="relative p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadNotifications > 0 && <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />}
                        </button>

                        <div className="flex items-center gap-2">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                                <AvatarFallback>RW</AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block text-sm">
                                <div className="font-medium">{currentUser.name}</div>
                                <div className="text-xs text-muted-foreground">{currentUser.role}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
        </>
    )
}