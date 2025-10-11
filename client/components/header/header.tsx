"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cloud, Bell, CheckCircle, FileText, Clock, Calendar, SquareMenu } from "lucide-react"
import { useState } from "react"
import { NotificationPanel } from "@/components/notification-panel"
import UserDropdown from "@/components/header/UserDropdown"
import MobileMenuDropdown from "@/components/header/MobileMenuDropdown"

export default function Header() {
    const path = usePathname()
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const unreadNotifications = 3

    // Tabs for desktop navigation
    const tabs = [
        { href: "/dashboard", label: "Dashboard", icon: CheckCircle },
        { href: "/order", label: "Order", icon: FileText },
        { href: "/table", label: "Table", icon: Calendar },
        { href: "/menu", label: "Menu", icon: SquareMenu },
        { href: "/history", label: "History", icon: Clock },
    ]

    // Hide header on login page
    if (path?.startsWith("/login")) return null

    return (
        <>
            <header className="border-b bg-card sticky top-0 z-30">
                <div className="flex items-center justify-between px-6 py-4">
                    {/* LEFT SIDE: Brand + Desktop Nav */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <Cloud className="h-6 w-6 text-primary" />
                            <span className="text-xl font-semibold">EasyDining</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {tabs.map((t) => {
                                const active = path === t.href
                                return (
                                    <Link
                                        key={t.href}
                                        href={t.href}
                                        className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                                            active
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                        }`}
                                    >
                                        <t.icon className="h-4 w-4" />
                                        {t.label}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    {/* RIGHT SIDE: Notifications + User + Mobile Menu */}
                    <div className="flex items-center gap-4">
                        {/* Desktop notifications */}
                        <button
                            onClick={() => setIsNotificationOpen(true)}
                            className="relative hidden md:block p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadNotifications > 0 && (
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                            )}
                        </button>

                        {/* Desktop user dropdown */}
                        <div className="hidden md:block">
                            <UserDropdown />
                        </div>

                        {/* Mobile Menu Dropdown */}
                        <div className="md:hidden">
                            <MobileMenuDropdown tabs={tabs} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Notification side panel */}
            <NotificationPanel
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
            />
        </>
    )
}
