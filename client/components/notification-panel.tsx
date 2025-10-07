"use client"

import { useState } from "react"
import { X, Package, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { notifications as mockNotifications } from "@/lib/mock-data"
import type { Notification } from "@/lib/mock-data"

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<"all" | "inventory" | "kitchen">("all")
  const [notifications, setNotifications] = useState(mockNotifications)

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true
    return notif.type === activeTab
  })

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, status: "read" as const })))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "inventory":
        return <Package className="h-5 w-5" />
      case "kitchen":
        return <ChefHat className="h-5 w-5" />
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Notification</h2>
          <div className="flex items-center gap-2">
            <button onClick={handleMarkAllRead} className="text-sm text-primary hover:underline">
              Mark all as read
            </button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "all"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            All Notification
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "inventory"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("kitchen")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "kitchen"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Kitchen
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b hover:bg-accent/50 transition-colors ${
                notification.status === "unread" ? "bg-accent/20" : ""
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`p-2 rounded-lg h-fit ${
                    notification.type === "inventory" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start gap-2">
                    {notification.type === "inventory" && <span className="text-lg">⚠️</span>}
                    {notification.type === "kitchen" && <span className="text-lg">👨‍🍳</span>}
                    <h3 className="font-medium text-sm">{notification.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{notification.message}</p>
                  {notification.actionLabel && (
                    <Button
                      variant={notification.status === "read" ? "outline" : "default"}
                      size="sm"
                      className="mt-2"
                      disabled={notification.status === "read"}
                    >
                      {notification.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
