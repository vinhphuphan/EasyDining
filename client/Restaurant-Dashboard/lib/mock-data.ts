export interface Notification {
  id: string
  type: "inventory" | "kitchen" | "general"
  title: string
  message: string
  status: "unread" | "read"
  relatedEntity?: string
  createdAt: string
  actionLabel?: string
  icon?: string
}

export const notifications: Notification[] = [
  {
    id: "1",
    type: "inventory",
    title: "Low Stock Alert!",
    message: "The stock for Salmon Fillet is running low. Please reorder soon to avoid disruption.",
    status: "unread",
    relatedEntity: "Salmon Fillet",
    createdAt: "2 hours ago",
    actionLabel: "Request Ingredients",
    icon: "📦",
  },
  {
    id: "2",
    type: "kitchen",
    title: "Dish Ready to Serve!",
    message: "The kitchen has finished preparing Butter Chicken. Please serve it to the table A8 promptly.",
    status: "unread",
    relatedEntity: "Butter Chicken",
    createdAt: "5 minutes ago",
    icon: "👨‍🍳",
  },
  {
    id: "3",
    type: "kitchen",
    title: "Dish Ready to Serve!",
    message: "The kitchen has finished preparing Pasta Bolognese. Please serve it to the table B12 promptly.",
    status: "unread",
    relatedEntity: "Pasta Bolognese",
    createdAt: "8 minutes ago",
    icon: "👨‍🍳",
  },
  {
    id: "4",
    type: "inventory",
    title: "Low Stock Alert!",
    message: "The stock for Bok Choy is running low. Please reorder soon to avoid disruption.",
    status: "read",
    relatedEntity: "Bok Choy",
    createdAt: "1 day ago",
    actionLabel: "Already Request",
    icon: "📦",
  },
]
